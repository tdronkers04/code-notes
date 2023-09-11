import express, { Application, Request, Response } from 'express';
import 'dotenv/config';
import {
  ClerkExpressWithAuth,
  LooseAuthProp,
  WithAuthProp,
} from '@clerk/clerk-sdk-node';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request extends LooseAuthProp {}
  }
}

const app: Application = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server!!!');
});

app.get(
  '/protected-route',
  ClerkExpressWithAuth({
    // ...options
  }),
  (req: WithAuthProp<Request>, res: Response) => {
    res.json(req.auth);
  },
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
