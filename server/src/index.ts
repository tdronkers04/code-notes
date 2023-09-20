import express, { Application, Request, Response } from 'express';
import 'dotenv/config';
import {
  ClerkExpressWithAuth,
  LooseAuthProp,
  WithAuthProp,
  users,
} from '@clerk/clerk-sdk-node';
import { prisma } from './utils/db';
import loggerMiddleware from './utils/logger';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request extends LooseAuthProp {}
  }
}

const app: Application = express();
const port = process.env.PORT;

app.use(express.json());
app.use(loggerMiddleware);

app.get(
  '/notes',
  ClerkExpressWithAuth(),
  async (req: WithAuthProp<Request>, res: Response) => {
    const clerkUser = await users.getUser(req.auth.userId || '');
    const match = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id as string,
      },
    });

    // if user does not exist in DB, create user
    if (!match) {
      await prisma.user.create({
        data: {
          clerkId: clerkUser.id || '',
          email: clerkUser?.emailAddresses[0].emailAddress || '',
        },
      });
    }

    // query notes associated with user

    const notes = await prisma.note.findMany({
      where: {
        userId: clerkUser.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json(notes);
  },
);

app.post(
  '/new-note',
  ClerkExpressWithAuth(),
  async (req: WithAuthProp<Request>, res: Response) => {
    const clerkUser = await users.getUser(req.auth.userId || '');

    await prisma.note.create({
      data: {
        userId: clerkUser.id,
        code: req.body.code,
        title: 'untitled',
      },
    });

    const notes = await prisma.note.findMany({
      where: {
        userId: clerkUser.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json(notes);
  },
);

app.delete(
  '/note/:id',
  ClerkExpressWithAuth(),
  async (req: WithAuthProp<Request>, res: Response) => {
    const clerkUser = await users.getUser(req.auth.userId || '');
    const { id } = req.params;

    await prisma.note.delete({
      where: {
        id: id,
        userId: clerkUser.id,
      },
    });

    const notes = await prisma.note.findMany({
      where: {
        userId: clerkUser.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json(notes);
  },
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
