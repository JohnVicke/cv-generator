"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepo = exports.getUser = exports.getAxiosInstance = void 0;
const axios_1 = __importDefault(require("axios"));
const GITHUB_API_URL = 'https://api.github.com';
let api;
const setToken = (axios, token) => {
    axios.defaults.headers = {
        Authorization: `Bearer ${token}`
    };
    return axios;
};
const getAxiosInstance = (token) => {
    if (api) {
        if (token) {
            setToken(api, token);
        }
        return api;
    }
    api = axios_1.default.create({
        baseURL: GITHUB_API_URL,
        headers: {
            common: {
                Accept: 'application/vnd.github.v3+json'
            }
        }
    });
    if (token) {
        setToken(api, token);
    }
    return api;
};
exports.getAxiosInstance = getAxiosInstance;
const getUser = (token) => {
    return (0, exports.getAxiosInstance)(token).get('/user');
};
exports.getUser = getUser;
const getRepo = (userRepoUrl, token) => {
    return (0, exports.getAxiosInstance)(token).get(userRepoUrl);
};
exports.getRepo = getRepo;
//# sourceMappingURL=api.js.map