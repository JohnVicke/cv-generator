"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv-safe");
const express_1 = __importDefault(require("express"));
const index_1 = require("./github/index");
const PORT = process.env.PORT || 8080;
const github = new index_1.GithubAPI();
const ghAuthCheck = (_, res, next) => {
    if (github.isAuthentiated())
        next();
    else
        res.redirect("/");
};
(async () => {
    const app = (0, express_1.default)();
    app.get("/", (_, res) => {
        github.redirect(res);
    });
    app.get("/oauth-callback", async (req, res) => {
        const { success, error } = await github.setToken(req.query.code);
        if (error)
            return res.status(500).json({ success, error });
        return res.redirect("/user");
    });
    app.get("/user", ghAuthCheck, async (_, res) => {
        const { success, error, user } = await github.getUser();
        res.send({ success, error, user, token: github.getToken() });
    });
    app.get("/check-repo-existing", ghAuthCheck, async (_, res) => {
        const { success, error, repoExists } = await github.checkIfRepoExists();
        if (!repoExists)
            await github.createRepo();
        res.send({ success, error, repoExists });
    });
    app.listen(PORT, () => console.log(`server started on ${PORT}`));
})().catch((error) => {
    console.error(error);
});
//# sourceMappingURL=index.js.map