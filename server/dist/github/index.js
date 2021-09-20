"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubAPI = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const Base64_1 = require("../util/Base64");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const api_1 = require("./api");
const typeorm_1 = require("typeorm");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const GITHUB_BASE_AUTH_URL = 'https://github.com/login/oauth';
const GITHUB_API_URL = 'https://api.github.com';
const CV_GEN_REPO_NAME = 'resume2';
class GithubAPI {
    constructor() {
        this.config = {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET
        };
        this.axios = axios_1.default.create({
            baseURL: GITHUB_API_URL,
            headers: {
                common: {
                    Accept: 'application/vnd.github.v3+json'
                }
            }
        });
    }
    getToken() {
        return this.token;
    }
    async setToken(code) {
        const body = Object.assign(Object.assign({}, this.config), { code });
        const options = {
            headers: {
                accept: 'application/json'
            }
        };
        try {
            const res = await axios_1.default.post(`${GITHUB_BASE_AUTH_URL}/access_token`, body, options);
            this.token = res.data['access_token'];
            this.axios.defaults.headers = {
                Authorization: `Token ${this.token}`
            };
            return { success: true };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    redirect(res) {
        res.send(`${GITHUB_BASE_AUTH_URL}/authorize?client_id=${this.config.client_id}&scope=repo`);
    }
    async checkIfRepoExists() {
        try {
            const getRepoRes = await axios_1.default.get(this.user.reposUrl);
            const cvGenRepo = getRepoRes.data.find((repo) => repo.name === CV_GEN_REPO_NAME);
            return { success: true, repoExists: !!cvGenRepo };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async createRepo() {
        try {
            const body = {
                name: CV_GEN_REPO_NAME
            };
            const createRepoRes = await this.axios.post('user/repos', body);
            if (createRepoRes.data.statusText === 'Created') {
                console.log('created new repo');
            }
            return { success: true };
        }
        catch (err) {
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
            const res = await this.axios.post(`/repos/${this.user.login}/${CV_GEN_REPO_NAME}/pages`, body, {
                headers: {
                    Accept: 'application/vnd.github.switcheroo-preview+json'
                }
            });
            return { success: true, url: res.data.html_url };
        }
        catch (err) {
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
            const html = await this.uploadFile(constants_1.CV_GENERATOR_INITIAL_COMMIT, (0, utils_1.getIndexHtml)({ owner: login, name }), 'index.html');
            const resume = await this.uploadFile(constants_1.CV_GENERATOR_INITIAL_COMMIT, (0, utils_1.getResume)(), 'resume.pdf');
            const readme = await this.uploadFile(constants_1.CV_GENERATOR_INITIAL_COMMIT, (0, utils_1.getReadme)(), 'README.md');
            return {
                html,
                resume,
                readme
            };
        }
        catch (err) {
            console.error(err);
            return { success: false, error: true };
        }
    }
    async checkIfFileExists(fileName) {
        try {
            const res = await this.axios.get(`/repos/${this.user.login}/${CV_GEN_REPO_NAME}/contents/${fileName}`);
            const sha = res.data.sha;
            return { sha };
        }
        catch (err) {
            console.error(err);
            return { error: err.message };
        }
    }
    async uploadFile(message, content, fileName) {
        try {
            const { sha } = await this.checkIfFileExists(fileName);
            const body = {
                message,
                content: (0, Base64_1.stringToBase64)(content),
                branch: 'main',
                sha
            };
            const res = await this.axios.put(`/repos/${this.user.login}/${CV_GEN_REPO_NAME}/contents/${fileName}`, body);
            return { success: res.status === 200 };
        }
        catch (err) {
            console.error(err);
            return { success: false, error: err.message };
        }
    }
    async getUser(token) {
        try {
            const res = await (0, api_1.getAxiosInstance)(token).get('/user');
            const { login, id, node_id: nodeId, repos_url: reposUrl, name } = await res.data;
            const user = {
                name,
                login,
                id,
                nodeId,
                reposUrl
            };
            await (0, typeorm_1.getConnection)()
                .getRepository('User')
                .save({ login, name, reposUrl });
            this.user = user;
            return { success: true, user };
        }
        catch (err) {
            console.log(err);
            return { success: false, error: err.message };
        }
    }
    isAuthentiated() {
        return !!this.token;
    }
}
exports.GithubAPI = GithubAPI;
//# sourceMappingURL=index.js.map