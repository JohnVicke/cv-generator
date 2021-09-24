import { AxiosRequestConfig } from 'axios';
import Axios from '../utils/Axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = Axios;
axiosInstance.setDefaults({
  baseURL: `${baseUrl as string}/api/v1/github/`,
  headers: {
    'Access-Control-Allow-Origin': baseUrl
  }
});

const config = { withCredentials: true };

type GetUserBody = AxiosRequestConfig & {
  code: string;
};

export const getUser = (body: GetUserBody) => {
  return axiosInstance.post('/initialize-github', body);
};

export const uploadResume = (formData: FormData) => {
  return axiosInstance.post('/upload-resume', formData, {
    widthCredentials: true
  });
};

export const loginWithGithub = () => {
  return axiosInstance.get('/get-redirect', '', config);
};

export const getRepository = () => {
  return axiosInstance.get('/repo-exists', '', config);
};

export const createRepo = () => {
  return axiosInstance.get('/create-repo', '', config);
};
