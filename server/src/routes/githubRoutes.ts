import express from 'express';
import { ghAuthCheck } from '../middleware/ghAuthCheck';
import {
  getAccessToken,
  getRedirect,
  intializeUser,
  uploadResume
} from '../controllers/githubController';
const router = express.Router();

router.get('/get-redirect', getRedirect);
router.post('/initialize-github', getAccessToken);
router.get('/user', ghAuthCheck, intializeUser);
router.post('/upload-resume', ghAuthCheck, uploadResume);

export { router as gitHubRouter };
