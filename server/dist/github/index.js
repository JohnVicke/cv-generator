"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const GITHUB_BASE_AUTH_URL = "https://github.com/login/oauth";
const GITHUB_API_URL = "https://api.github.com";
const CV_GEN_REPO_NAME = "resume2";
class GithubAPI {
    getToken() {
        return this.token;
    }
    async setToken(code) {
        const body = {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
        };
        const options = {
            headers: {
                accept: "application/json",
            },
        };
        try {
            const res = await axios_1.default.post(`${GITHUB_BASE_AUTH_URL}/access_token`, body, options);
            this.token = res.data["access_token"];
            return { success: true };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    redirect(res) {
        res.redirect(`${GITHUB_BASE_AUTH_URL}/authorize?client_id=${CLIENT_ID}&scope=repo`);
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
            const data = {
                name: CV_GEN_REPO_NAME,
                private: false,
            };
            const headers = {
                Accept: "application/vnd.github.v3+json",
                Authorization: `Bearer ${this.token}`,
            };
            const createRepoRes = await axios_1.default.post(`${GITHUB_API_URL}/user/repos`, {
                data,
                headers,
            });
            return { success: true };
        }
        catch (err) {
            console.error(err);
            return { success: false, error: err.message };
        }
    }
    async getUser() {
        const headers = {
            Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${this.token}`,
        };
        try {
            const res = await axios_1.default.get(`${GITHUB_API_URL}/user`, {
                headers,
            });
            const { login, id, node_id: nodeId, repos_url: reposUrl, } = await res.data;
            const user = {
                login,
                id,
                nodeId,
                reposUrl,
            };
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