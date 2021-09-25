import 'dotenv-safe';

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import { createConnection } from 'typeorm';

import { GithubAPI } from './github/index';
import { COOKIE_NAME } from './constants';
import { User } from './entity/User';
import { gitHubRouter } from './routes/githubRoutes';
import { getGithubAccessToken, setGitHubToken } from './github/api';

interface ExpressFileUploadRequest extends Request {
  files: {
    resume?: any;
  };
}

const reactPath = path.join(__dirname, '/views/');

const __prod__ = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 8080;
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const github = new GithubAPI();

const ghAuthCheck = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.token) {
    return next();
  }
  return res.send({ success: false, message: 'not logged in' });
};

(async () => {
  const app = express();
  if (__prod__) {
    app.set('proxy', 1); // trust first proxy
  }
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URI,
    ssl: { rejectUnauthorized: __prod__ },
    logging: true,
    synchronize: true,
    entities: [User],
    migrations: [path.join(__dirname, './migrations/*')]
  });

  const RedisStore = connectRedis(session);

  const redisOptions = __prod__
    ? {
        tls: { rejectUnauthorized: false }
      }
    : undefined;

  const redis = new Redis(process.env.TLS_URL, redisOptions);

  app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
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
        secure: __prod__,
        sameSite: __prod__ ? 'none' : 'lax',
        domain: __prod__ ? process.env.CORS_ORIGIN : undefined
      },
      secret: process.env.REDIS_SECRET,
      resave: false
    })
  );

  app.use(express.static(reactPath));

  app.get('/api/v1/', (_, res: Response) => {
    res.send({
      version: 1,
      name: 'CV-Generator REST api'
    });
  });

  app.use('/api/v1/github', gitHubRouter);

  app.use('*', (_, res: Response) => {
    res.sendFile(path.join(reactPath, 'index.html'));
  });

  app.listen(PORT, () => console.log(`server started on ${PORT}`));
})().catch((error: any) => {
  console.error(error);
});
