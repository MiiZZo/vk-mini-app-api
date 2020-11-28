import { getRepository } from "typeorm";
import { Router } from "express";
import { User } from "./user.entity";
import { checkAuth } from "../common/check-auth";

export const usersRouter = Router();

usersRouter.get("/:id", async (req, res) => {
  const repository = getRepository(User);

  res.json(await repository.findOne(req.params["id"]));
});

usersRouter.post("/", checkAuth, (req, res) => {
  try {
    const usersRepository = getRepository(User);

    const user = usersRepository.create({
      id: req.body.id,
      //@ts-ignore
      discordId: req.user.id
    });

    res.json(usersRepository.save(user));
  } catch(e) {
    console.log(e);
  }
});
