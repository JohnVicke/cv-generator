import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

let api: AxiosInstance | undefined;

const getAxiosClient = (): AxiosInstance => {
  if (api) {
    return api;
  }
  const baseUrl = 'https://resume-hosting.herokuapp.com';

  api = axios.create({
    baseURL: `${baseUrl}/api/v1/github`,
    withCredentials: true
  });
  api.defaults.headers = {
    'Access-Control-Allow-Origin': baseUrl
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

export const loginWithGithub = () => {
  return getAxiosClient().get('/get-redirect');
};
