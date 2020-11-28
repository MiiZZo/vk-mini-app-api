import express, { NextFunction } from "express";
import { Strategy } from "passport-discord";
import { createConnection, getRepository } from "typeorm";
import { User } from "./users/user.entity";
import { usersRouter } from "./users/users.router";
import passport from "passport";
import session from "express-session";
import { checkAuth } from "./common/check-auth";

const scopes = ["identify"];

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

const bootstrap = async () => {
  try {
    const app = express();

    createConnection().then((value) => {
      console.log(value);
    });

    passport.use(
      new Strategy(
        {
          clientID: "782262797689290752",
          clientSecret: "INO0EdLc9MgpxLaK2Wp53uuIN0W0QfZG",
          callbackURL: "/auth/discord/callback",
          scope: scopes,
          passReqToCallback: true,
        },
        function (
          req: express.Request,
          accessToken: string,
          refreshToken: string,
          profile: Strategy.Profile,
          cb: Function
        ) {
          process.nextTick(function () {
            cb(null, profile);
          });
        }
      )
    );

    app.use(express.json());

    app.use(
      session({
        secret: "youshallnotpass",
        resave: false,
        saveUninitialized: false,
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.get("/auth/discord", function (req, res, next) {
      passport.authenticate("discord", { scope: scopes })(req, res, next);
    });

    app.get(
      "/auth/discord/callback",
      passport.authenticate("discord"),
      function (req, res) {
        res.redirect("/");
      }
    );

    app.get("/", checkAuth, (req, res) => {
      res.json(req.user);
    });

    app.use("/users", usersRouter);

    app.listen(4000, () => console.log("http://localhost:4000"));
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

bootstrap();
