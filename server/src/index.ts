import express, { Application, Request, Response } from 'express';
import * as path from 'path';
import cors from 'cors';
import 'dotenv/config';
import {
  ClerkExpressWithAuth,
  LooseAuthProp,
  WithAuthProp,
  users,
} from '@clerk/clerk-sdk-node';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import { prisma } from './utils/db';
import loggerMiddleware from './utils/logger';
import analyze from './utils/ai';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request extends LooseAuthProp {}
  }
}

const app: Application = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8000;
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50,
});

app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'blob:',
        'loyal-wolf-53.clerk.accounts.dev',
      ],
      connectSrc: ["'self'", 'loyal-wolf-53.clerk.accounts.dev'],
      imgSrc: ["'self'", 'https://img.clerk.com'],
    },
  }),
);

app.get(
  '/api/notes',
  ClerkExpressWithAuth(),
  async (req: WithAuthProp<Request>, res: Response) => {
    const clerkUser = await users.getUser(req.auth.userId || '');
    const match = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id as string,
      },
    });

    if (!match) {
      await prisma.user.create({
        data: {
          clerkId: clerkUser.id || '',
          email: clerkUser?.emailAddresses[0].emailAddress || '',
        },
      });
    }

    const notes = await prisma.notes.findMany({
      where: {
        userId: clerkUser.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.status(200).json(notes);
  },
);

app.get(
  '/api/notes/:id/analysis',
  ClerkExpressWithAuth(),
  async (req: WithAuthProp<Request>, res: Response) => {
    const { id } = req.params;

    const noteAnalysis = await prisma.analysis.findUnique({
      where: {
        noteId: id,
      },
    });

    res.status(200).json(noteAnalysis);
  },
);

app.post(
  '/api/notes',
  ClerkExpressWithAuth(),
  async (req: WithAuthProp<Request>, res: Response) => {
    const clerkUser = await users.getUser(req.auth.userId || '');

    const newNote = await prisma.notes.create({
      data: {
        userId: clerkUser.id,
        code: req.body.code,
        title: 'untitled',
      },
    });

    const analysis = await analyze(newNote.code);

    await prisma.analysis.create({
      data: {
        noteId: newNote.id,
        language: analysis.language,
        paradigm: analysis.paradigm,
        summary: analysis.summary,
        recommendation: analysis.recommendation,
      },
    });

    res.status(201).json(newNote);
  },
);

app.delete(
  '/api/notes/:id',
  ClerkExpressWithAuth(),
  async (req: WithAuthProp<Request>, res: Response) => {
    const clerkUser = await users.getUser(req.auth.userId || '');
    const { id } = req.params;

    await prisma.notes.delete({
      where: {
        id: id,
        userId: clerkUser.id,
      },
    });

    res.status(204).send();
  },
);

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is listening on port ${port} of ${host}`);
});
