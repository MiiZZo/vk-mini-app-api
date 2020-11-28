import { NextFunction, Response } from "express";

export const checkAuth = (req: any, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  res.send("not logged in :(");
}
