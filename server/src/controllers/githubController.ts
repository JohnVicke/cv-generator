import { Request, Response } from 'express';
import {
  fileExistsOnGithub,
  getGithubAccessToken,
  getGithubUser,
  uploadSingleFile
} from '../github/api';
import { getConnection } from 'typeorm';
import { User } from 'src/entity/User';

type FileExistsQueryParams = {
  token: string;
  login: string;
  filename: string;
};

interface ExpressFileUploadRequest extends Request {
  files: {
    resume?: any;
  };
}

const GITHUB_BASE_AUTH_URL = 'https://github.com/login/oauth';

const genericErrorMessage = (res: Response, err: Error) => {
  return res.status(500).json({ success: false, error: err.message });
};

export const getRedirect = (_: Request, res: Response) => {
  res.send(
    `${GITHUB_BASE_AUTH_URL}/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`
  );
};

export const getAccessToken = async (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code) {
    res.status(204).json({
      success: false,
      msg: 'No client code provided in body'
    });
  }
  try {
    const { data } = await getGithubAccessToken(code);
    const token = (data as string).slice(13, (data as string).indexOf('&'));
    req.session.token = token;
    console.log(token);
    return res.redirect('/api/v1/github/user');
  } catch (err) {
    return genericErrorMessage(res, err);
  }
};

export const intializeUser = async (req: Request, res: Response) => {
  try {
    const { data } = await getGithubUser(req.session.token);

    const userRepo = getConnection().getRepository('User');

    const userAlreadyExists = await userRepo.findOne({
      where: { login: data.login }
    });

    if (userAlreadyExists) {
      return res.send(userAlreadyExists);
    }

    const user = await getConnection().getRepository('User').save({
      login: data.login,
      name: data.name,
      reposUrl: data.repos_url
    });
    return res.send(user);
  } catch (err) {
    return genericErrorMessage(res, err);
  }
};

const getFileSha = async ({
  token,
  login,
  filename
}: FileExistsQueryParams) => {
  try {
    const { data } = await fileExistsOnGithub({ token, login, filename });
    return { sha: data.sha };
  } catch (err) {
    return { error: err.message };
  }
};

export const uploadResume = async (req: Request, res: Response) => {
  if (!req.files) {
    return genericErrorMessage(res, new Error('file not provided'));
  }

  const user = (await getConnection().getRepository('User').findOne(1)) as User;
  console.log('user', user);

  const getFileShaParams: FileExistsQueryParams = {
    token: req.session.token,
    login: user.login,
    filename: 'resume.pdf'
  };

  const { sha } = await getFileSha(getFileShaParams);
  const resume = (req as ExpressFileUploadRequest).files.resume;

  console.log('sha', sha);

  const { data } = await uploadSingleFile({
    ...getFileShaParams,
    message: 'hello world',
    content: resume.data,
    sha
  });

  console.log('data: ', data);

  return res.send({ wow: 'hello' });
};
