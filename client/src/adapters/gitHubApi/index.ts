import Axios from '../../utils/Axios';
import { BASE_URL_DEV, BASE_URL_PROD, __prod__ } from '../../constants';

const baseUrl = __prod__ ? BASE_URL_PROD : BASE_URL_DEV;

const gitHub = Axios;

gitHub.setDefaults({
  baseURL: `${baseUrl as string}/api/v1/github/`,
  headers: {
    'Access-Control-Allow-Origin': baseUrl
  }
});

const config = { withCredentials: true };

export const getUser = () => {
  return gitHub.get('/user');
};

export const uploadResume = (formData: FormData) => {
  return gitHub.post('/upload-resume', formData);
};

export const loginWithGithub = () => {
  return gitHub.get('/get-redirect', '', config);
};

export const getRepository = () => {
  return gitHub.get('/repo-exists', '', config);
};

export const createRepo = () => {
  return gitHub.get('/create-repo', '', config);
};
