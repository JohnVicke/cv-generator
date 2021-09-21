import { Request, Response, NextFunction } from 'express';

export const ghAuthCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.token) return next();
  return res.send({ success: false, msg: 'not logged in' });
};
