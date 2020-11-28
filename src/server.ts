import express from "express";
import { Strategy } from "passport-discord";
import { createConnection, getRepository } from "typeorm";
import { User } from "./users/user.entity";
import { usersRouter } from "./users/users";
import passport from "passport";
import session from "express-session";

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

    // await createConnection();

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

    app.use(
      session({
        secret: "youshallnotpass",
        resave: false,
        saveUninitialized: false,
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    //@ts-ignore
    function checkAuth(req, res, next) {
      if (req.isAuthenticated()) return next();
      res.send("not logged in :(");
    }

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
      if (req.user) {
        console.log(req.user);
      }
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
