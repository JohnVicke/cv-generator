"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv-safe");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const ioredis_1 = __importDefault(require("ioredis"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_session_1 = __importDefault(require("express-session"));
const index_1 = require("./github/index");
const constants_1 = require("./constants");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const PORT = process.env.PORT || 8080;
const __prod__ = process.env.NODE_ENV || 'development';
const github = new index_1.GithubAPI();
const ghAuthCheck = (req, res, next) => {
    if (req.session.token) {
        return next();
    }
    return res.send({ success: false, message: 'not logged in' });
};
(async () => {
    const app = (0, express_1.default)();
    await (0, typeorm_1.createConnection)({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: true,
        entities: [User_1.User],
        migrations: [path_1.default.join(__dirname, './migrations/*')]
    });
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default(process.env.REDIS_URL);
    app.use((0, cors_1.default)({ credentials: true, origin: 'http://localhost:3000' }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({
        extended: true
    }));
    app.use((0, express_fileupload_1.default)());
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            secure: !__prod__,
            sameSite: 'lax',
            domain: !__prod__ ? '.viktormalmedal.com' : undefined
        },
        secret: process.env.REDIS_SECRET,
        resave: false
    }));
    dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
    app.get('/get-redirect', (_, res) => {
        github.redirect(res);
    });
    app.post('/initialize-github', async (req, res) => {
        const { code } = req.body;
        const { success, error } = await github.setToken(code);
        if (error)
            return res.status(500).json({ success, error });
        req.session.token = github.getToken();
        return res.redirect('/user');
    });
    app.get('/user', async (req, res) => {
        const { success, error, user } = await github.getUser(req.session.token);
        return res.send({ success, error, user });
    });
    app.get('/check-repo-existing', ghAuthCheck, async (req, res) => {
        const { success, error, repoExists } = await github.checkIfRepoExists(req.session.token);
        res.send({ success, error, repoExists });
    });
    app.get('/enable-github-page', ghAuthCheck, async (_, res) => {
        const result = await github.createGithubPage();
        res.send({ result });
    });
    app.get('/populate-repo', ghAuthCheck, async (_, res) => {
        const populateRes = await github.populateRepo();
        res.send({ populateRes });
    });
    app.post('/upload-resume', ghAuthCheck, async (req, res) => {
        if (!req.files) {
            return res.status(500).send({ error: 'file not found' });
        }
        const resume = req.files.resume;
        const result = await github.uploadFile('hello world', resume.data, 'resume.pdf');
        console.log(result);
        return res.send({ wow: 'hello' });
    });
    app.listen(PORT, () => console.log(`server started on ${PORT}`));
})().catch((error) => {
    console.error(error);
});
//# sourceMappingURL=index.js.map