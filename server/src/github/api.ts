import axios from 'axios';
import Axios from '../util/Axios';
import { stringToBase64 } from '../util/Base64';

const CV_GEN_REPO_NAME = 'resume2';

export type FileExistsQueryOptions = {
  login: string;
  filename: string;
};

export type UploadSingleFileOptions = FileExistsQueryOptions & {
  sha?: string;
  content: string;
  message: string;
};

export type RepoExistsOptions = {
  userRepoUrl: string;
};

const GITHUB_BASE_AUTH_URL = 'https://github.com/login/oauth';
const GITHUB_API_URL = 'https://api.github.com';

const axiosInstance = Axios;
axiosInstance.setDefaults({
  baseURL: GITHUB_API_URL,
  headers: {
    common: {
      Accept: 'application/vnd.github.v3+json'
    }
  }
});

export const setGitHubToken = (token: string) => {
  axiosInstance.setBearerToken(token);
};

export const getGithubUser = () => {
  return axiosInstance.get('/user');
};

export const getGithubRepository = (userRepoUrl: string) => {
  return axiosInstance.get(userRepoUrl);
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
  login
}: UploadSingleFileOptions) => {
  const body = {
    message,
    content: stringToBase64(content),
    branch: 'main',
    sha
  };
  return axiosInstance.put(
    `/repos/${login}/${CV_GEN_REPO_NAME}/contents/${filename}`,
    body
  );
};

export const fileExistsOnGithub = ({
  login,
  filename
}: FileExistsQueryOptions) => {
  return axiosInstance.get(
    `/repos/${login}/${CV_GEN_REPO_NAME}/contents/${filename}`
  );
};

export const createGitHubRepository = () => {
  const body = {
    name: CV_GEN_REPO_NAME
  };
  return axiosInstance.post('user/repos', body);
};

export const makeRepoIntoGitHubPage = (login: string) => {
  const body = {
    source: {
      branch: 'main'
    }
  };

  return axiosInstance.post(`/repos/${login}/${CV_GEN_REPO_NAME}/pages`, body, {
    headers: {
      Accept: 'application/vnd.github.switcheroo-preview+json'
    }
  });
};
