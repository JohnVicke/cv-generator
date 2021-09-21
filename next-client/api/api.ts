import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

let api: AxiosInstance | undefined;

const getAxiosClient = (): AxiosInstance => {
  if (api) {
    return api;
  }
  api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/github',
    withCredentials: true
  });
  api.defaults.headers = {
    'Access-Control-Allow-Origin': 'http://localhost:8080'
  };
  return api;
};

type GetUserBody = AxiosRequestConfig & {
  code: string;
};

export const getUser = (body: GetUserBody) => {
  return getAxiosClient().post('/initialize-github', body);
};

export const uploadResume = (formData: FormData) => {
  return getAxiosClient().post('/upload-resume', formData);
};
