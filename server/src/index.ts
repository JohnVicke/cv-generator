import 'dotenv-safe';

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import session from 'express-session';

import { GithubAPI } from './github/index';
import { COOKIE_NAME } from './constants';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
import fileUpload from 'express-fileupload';

interface ExpressFileUploadRequest extends Request {
  files: {
    resume?: any;
  };
}

const PORT = process.env.PORT || 8080;
const __prod__ = process.env.NODE_ENV || 'development';

const github = new GithubAPI();

const ghAuthCheck = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.token) {
    return next();
  }
  return res.send({ success: false, message: 'not logged in' });
};

(async () => {
  const app = express();
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    entities: [User],
    migrations: [path.join(__dirname, './migrations/*')]
  });

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true
    })
  );
  app.use(fileUpload());

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: !__prod__,
        sameSite: 'lax',
        domain: !__prod__ ? '.viktormalmedal.com' : undefined
      },
      secret: process.env.REDIS_SECRET,
      resave: false
    })
  );

  dotenv.config({ path: path.resolve(__dirname, '../.env') });

  app.get('/get-redirect', (_: Request, res: Response) => {
    github.redirect(res);
  });

  app.post('/initialize-github', async (req: Request, res: Response) => {
    const { code } = req.body;
    const { success, error } = await github.setToken(code as string);

    if (error) return res.status(500).json({ success, error });
    req.session.token = github.getToken();
    return res.redirect('/user');
  });

  app.get('/user', async (req: Request, res: Response) => {
    const { success, error, user } = await github.getUser(req.session.token);
    return res.send({ success, error, user });
  });

  app.get(
    '/check-repo-existing',
    ghAuthCheck,
    async (req: Request, res: Response) => {
      const { success, error, repoExists } = await github.checkIfRepoExists(
        req.session.token
      );
      res.send({ success, error, repoExists });
    }
  );

  app.get(
    '/enable-github-page',
    ghAuthCheck,
    async (_: Request, res: Response) => {
      const result = await github.createGithubPage();
      res.send({ result });
    }
  );

  app.get('/populate-repo', ghAuthCheck, async (_: Request, res: Response) => {
    const populateRes = await github.populateRepo();

    res.send({ populateRes });
  });

  app.post(
    '/upload-resume',
    ghAuthCheck,
    async (req: Request, res: Response) => {
      if (!req.files) {
        return res.status(500).send({ error: 'file not found' });
      }

      const resume = (req as ExpressFileUploadRequest).files.resume;
      const result = await github.uploadFile(
        'hello world',
        resume.data,
        'resume.pdf'
      );
      console.log(result);
      return res.send({ wow: 'hello' });
    }
  );

  app.listen(PORT, () => console.log(`server started on ${PORT}`));
})().catch((error: any) => {
  console.error(error);
});
