"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxiosInstance = void 0;
const axios_1 = __importDefault(require("axios"));
const GITHUB_API_URL = 'https://api.github.com';
let api;
const getAxiosInstance = (token) => {
    if (api)
        return api;
    api = axios_1.default.create({
        baseURL: GITHUB_API_URL,
        headers: {
            common: {
                Accept: 'application/vnd.github.v3+json'
            }
        }
    });
    if (token) {
        api.defaults.headers = {
            Authorization: `Bearer ${token}`
        };
    }
    return api;
};
exports.getAxiosInstance = getAxiosInstance;
//# sourceMappingURL=api.js.map