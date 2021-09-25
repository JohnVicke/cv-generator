import express from 'express';
import { ghAuthCheck } from '../middleware/ghAuthCheck';
import {
  checkIfRepoExists,
  createRepository,
  getAccessToken,
  getRedirect,
  handleOauthCallback,
  intializeUser,
  uploadResume
} from '../controllers/githubController';
const router = express.Router();

router.get('/get-redirect', getRedirect);
router.post('/initialize-github', getAccessToken);
router.get('/user', ghAuthCheck, intializeUser);
router.post('/upload-resume', ghAuthCheck, uploadResume);
router.get('/repo-exists', ghAuthCheck, checkIfRepoExists);
router.get('/create-repo', ghAuthCheck, createRepository);
router.get('/oauth-callback', handleOauthCallback);

export { router as gitHubRouter };
