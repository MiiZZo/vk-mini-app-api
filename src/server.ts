import express from "express";
import { Strategy } from "passport-discord";
import { createConnection, getRepository } from "typeorm";
import { User } from "./users/user.entity";
import { usersRouter } from "./users/users";

const passport = require("passport");
const  scopes = ["identify"];

const bootstrap = async () => {
  try {
    const app = express();

    // await createConnection();

    passport.use(
      new Strategy(
        {
          clientID: "782262797689290752",
          clientSecret: "INO0EdLc9MgpxLaK2Wp53uuIN0W0QfZG",
          callbackURL: "/auth/discord/callback",
          scope: scopes,
        },
        function (
          accessToken: string,
          refreshToken: string,
          profile: Strategy.Profile,
          cb: Function
        ) {
          // const { id } = profile;
          // const usersRepository = getRepository(User);
          
          // usersRepository.findOne();

          cb(null, {});
        }
      )
    );

    app.get("/auth/discord", passport.authenticate("discord"), (req, res) => {
      console.log(req, res);
    });

    app.get(
      "/auth/discord/callback",
      passport.authenticate("discord"),
      function (req, res) {
        res.send("<h1>Discord auth</h1>");
      }
    );

    app.get("/", (req, res) => {
      res.send("<h1>23</h1>")
    })

    app.use("/users", usersRouter);

    app.listen(4000, () => console.log("http://localhost:4000"));
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

bootstrap();
