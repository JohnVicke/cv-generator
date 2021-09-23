import axios, { AxiosInstance } from 'axios';
import { stringToBase64 } from '../util/Base64';

const CV_GEN_REPO_NAME = 'resume2';

export type FileExistsQueryOptions = {
  token: string;
  login: string;
  filename: string;
};

export type UploadSingleFileOptions = FileExistsQueryOptions & {
  sha?: string;
  content: string;
  message: string;
};

export type RepoExistsOptions = {
  token: string;
  userRepoUrl: string;
};

const GITHUB_BASE_AUTH_URL = 'https://github.com/login/oauth';
const GITHUB_API_URL = 'https://api.github.com';
let api: AxiosInstance | undefined;

const setToken = (axios: AxiosInstance, token: string) => {
  axios.defaults.headers = {
    Authorization: `Bearer ${token}`
  };
  return axios;
};

export const getAxiosInstance = (token?: string): AxiosInstance => {
  if (api) {
    if (token) setToken(api, token);
    return api;
  }
  api = axios.create({
    baseURL: GITHUB_API_URL,
    headers: {
      common: {
        Accept: 'application/vnd.github.v3+json'
      }
    }
  });

  if (token) setToken(api, token);
  return api;
};

export const getGithubUser = (token: string) => {
  return getAxiosInstance(token).get('/user');
};

export const getGithubRepository = (userRepoUrl: string, token: string) => {
  return getAxiosInstance(token).get(userRepoUrl);
};

export const getGithubAccessToken = async (code: string) => {
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code
  };
  return axios.post(`${GITHUB_BASE_AUTH_URL}/access_token`, body);
};

export const uploadSingleFile = ({
  sha,
  message,
  content,
  filename,
  login,
  token
}: UploadSingleFileOptions) => {
  const body = {
    message,
    content: stringToBase64(content),
    branch: 'main',
    sha
  };
  return getAxiosInstance(token).put(
    `/repos/${login}/${CV_GEN_REPO_NAME}/contents/${filename}`,
    body
  );
};

export const fileExistsOnGithub = ({
  token,
  login,
  filename
}: FileExistsQueryOptions) => {
  return getAxiosInstance(token).get(
    `/repos/${login}/${CV_GEN_REPO_NAME}/contents/${filename}`
  );
};

export const createGitHubRepository = (token: string) => {
  const body = {
    name: CV_GEN_REPO_NAME
  };
  return getAxiosInstance(token).post('user/repos', body);
};

export const makeRepoIntoGitHubPage = (login: string, token: string) => {
  const body = {
    source: {
      branch: 'main'
    }
  };

  return getAxiosInstance(token).post(
    `/repos/${login}/${CV_GEN_REPO_NAME}/pages`,
    body,
    {
      headers: {
        Accept: 'application/vnd.github.switcheroo-preview+json'
      }
    }
  );
};
