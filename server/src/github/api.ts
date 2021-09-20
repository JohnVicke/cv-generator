import axios, { AxiosInstance } from 'axios';

const GITHUB_API_URL = 'https://api.github.com';
let api: AxiosInstance | undefined;

export const getAxiosInstance = (token?: string): AxiosInstance => {
  if (api) return api;
  api = axios.create({
    baseURL: GITHUB_API_URL,
    headers: {
      common: {
        Accept: 'application/vnd.github.v3+json'
      }
    }
  });

  if (token) {
    api.defaults.headers = {
      Authorization: `Bearer ${token}`
    };
  }
  return api;
};
