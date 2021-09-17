import "dotenv-safe";
import express from "express";
import { Request, Response, NextFunction } from "express";

import { GithubAPI } from "./github/index";

const PORT = process.env.PORT || 8080;

const github = new GithubAPI();

const ghAuthCheck = (_: Request, res: Response, next: NextFunction) => {
  if (github.isAuthentiated()) next();
  else res.redirect("/");
};

(async () => {
  const app = express();

  app.get("/", (_, res: Response) => {
    github.redirect(res);
  });

  app.get("/oauth-callback", async (req: Request, res: Response) => {
    const { success, error } = await github.setToken(req.query.code as string);
    if (error) return res.status(500).json({ success, error });
    return res.redirect("/user");
  });

  app.get("/user", ghAuthCheck, async (_: Request, res: Response) => {
    const { success, error, user } = await github.getUser();
    res.send({ success, error, user, token: github.getToken() });
  });

  app.get(
    "/check-repo-existing",
    ghAuthCheck,
    async (_: Request, res: Response) => {
      const { success, error, repoExists } = await github.checkIfRepoExists();

      if (!repoExists) await github.createRepo();
      res.send({ success, error, repoExists });
    }
  );

  app.listen(PORT, () => console.log(`server started on ${PORT}`));
})().catch((error: any) => {
  console.error(error);
});
