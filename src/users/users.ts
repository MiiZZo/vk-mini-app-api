import { getRepository } from "typeorm";
import { Router } from "express";
import { User } from "./user.entity";

export const usersRouter = Router();

usersRouter.get("/:id", async (req, res) => {
  const repository = getRepository(User);

  res.json(await repository.findOne(req.params["id"]));
});
