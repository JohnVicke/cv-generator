import dotenv from 'dotenv';
import axios, { AxiosInstance } from 'axios';
import { Response } from 'express';
import path from 'path';
import { stringToBase64 } from '../util/Base64';
import { CV_GENERATOR_INITIAL_COMMIT } from './constants';
import { getIndexHtml, getReadme, getResume } from './utils';
import {
  getGithubAccessToken,
  getGithubRepository,
  getGithubUser
} from './api';
import { getConnection } from 'typeorm';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const GITHUB_BASE_AUTH_URL = 'https://github.com/login/oauth';
const GITHUB_API_URL = 'https://api.github.com';

const CV_GEN_REPO_NAME = 'resume2';

type BaseResponse = {
  success?: boolean;
  error?: string;
  redirect?: boolean;
};

type GithubUser = {
  login: string;
  id: number;
  nodeId: string;
  reposUrl: string;
  name: string;
};

type GithubAPIUserResponse = BaseResponse & {
  user?: GithubUser;
  token?: string;
};

type GithubAPIReposResponse = BaseResponse & {
  repoExists?: boolean;
};

export class GithubAPI {
  private token: string;
  private user: GithubUser;
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: GITHUB_API_URL,
      headers: {
        common: {
          Accept: 'application/vnd.github.v3+json'
        }
      }
    });
  }

  async getAccessToken(code: string): Promise<GithubAPIUserResponse> {
    try {
      const { data } = await getGithubAccessToken(code);
      return { success: true, token: data['access_token'] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  getRedirectLink(res: Response) {
    res.send(
      `${GITHUB_BASE_AUTH_URL}/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`
    );
  }

  async checkIfRepoExists(token: string): Promise<GithubAPIReposResponse> {
    try {
      const getRepoRes = await getGithubRepository(this.user.reposUrl, token);
      const cvGenRepo = getRepoRes.data.find(
        (repo: any) => repo.name === CV_GEN_REPO_NAME
      );
      return { success: true, repoExists: !!cvGenRepo };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async createRepo(): Promise<BaseResponse> {
    try {
      const body = {
        name: CV_GEN_REPO_NAME
      };

      const createRepoRes = await this.axios.post('user/repos', body);
      if (createRepoRes.data.statusText === 'Created') {
        console.log('created new repo');
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  }

  async createGithubPage() {
    try {
      const body = {
        source: {
          branch: 'main'
        }
      };

      const res = await this.axios.post(
        `/repos/${this.user.login}/${CV_GEN_REPO_NAME}/pages`,
        body,
        {
          headers: {
            Accept: 'application/vnd.github.switcheroo-preview+json'
          }
        }
      );

      return { success: true, url: res.data.html_url };
    } catch (err) {
      console.log(err);
      if (err.response.status === 409) {
        return { success: true, message: 'GitHub Pages is already enabled' };
      }
      return { success: false, error: err.message };
    }
  }

  async populateRepo() {
    const { login, name } = this.user;
    try {
      const html = await this.uploadFile(
        CV_GENERATOR_INITIAL_COMMIT,
        getIndexHtml({ owner: login, name }),
        'index.html'
      );
      const resume = await this.uploadFile(
        CV_GENERATOR_INITIAL_COMMIT,
        getResume(),
        'resume.pdf'
      );
      const readme = await this.uploadFile(
        CV_GENERATOR_INITIAL_COMMIT,
        getReadme(),
        'README.md'
      );
      return {
        html,
        resume,
        readme
      };
    } catch (err) {
      console.error(err);
      return { success: false, error: true };
    }
  }

  async checkIfFileExists(fileName: string) {
    try {
      const res = await this.axios.get(
        `/repos/${this.user.login}/${CV_GEN_REPO_NAME}/contents/${fileName}`
      );
      const sha = res.data.sha;
      return { sha };
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  async uploadFile(
    message: string,
    content: string,
    fileName: string
  ): Promise<BaseResponse> {
    try {
      const { sha } = await this.checkIfFileExists(fileName);

      const body = {
        message,
        content: stringToBase64(content),
        branch: 'main',
        sha
      };

      const res = await this.axios.put(
        `/repos/${this.user.login}/${CV_GEN_REPO_NAME}/contents/${fileName}`,
        body
      );

      return { success: res.status === 200 };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  }

  async getUser(token: string): Promise<GithubAPIUserResponse> {
    try {
      const res = await getGithubUser(token);

      const {
        login,
        id,
        node_id: nodeId,
        repos_url: reposUrl,
        name
      } = await res.data;

      const user = {
        name,
        login,
        id,
        nodeId,
        reposUrl
      };

      await getConnection()
        .getRepository('User')
        .save({ login, name, reposUrl });

      this.user = user;

      return { success: true, user };
    } catch (err) {
      console.log(err);
      return { success: false, error: err.message };
    }
  }
  isAuthentiated() {
    return !!this.token;
  }
}
