import axios, { AxiosInstance } from 'axios';

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
    if (token) {
      setToken(api, token);
    }
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

  if (token) {
    setToken(api, token);
  }
  return api;
};

export const getUser = (token: string) => {
  return getAxiosInstance(token).get('/user');
};

export const getRepo = (userRepoUrl: string, token: string) => {
  return getAxiosInstance(token).get(userRepoUrl);
};
