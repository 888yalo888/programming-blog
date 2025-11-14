import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import session from "express-session";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import connectPgSimple from "connect-pg-simple";
import { doubleCsrf } from "csrf-csrf";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import { findUserInDbOrNull, registerUser } from "./middlewares/middlewares";
import { pool } from "./configs/pool";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import imageRouter from "./routes/image";
import articleRouter from "./routes/article";

const app = express();

dotenv.config();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.PG_SESSION_SECRET_WORD!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      sameSite: "lax",
    },
  })
);
app.use(passport.authenticate("session"));

app.use(cookieParser());

const {
  validateRequest,
  generateCsrfToken, // Use this in your routes to provide a CSRF token.
  doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf({
  getSecret: (req?: express.Request) => {
    if (!req?.session?.csrfSecret) {
      req!.session!.csrfSecret = crypto.randomBytes(32).toString("hex");
    }
    return req!.session!.csrfSecret;
  },
  getSessionIdentifier: (req) => req.session.id, // return the requests unique identifier
});

app.use(doubleCsrfProtection);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/image", express.static("uploads"));

const PORT = 3001;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3001/api/auth/google/callback", //if authentication is successful it brings us to this callbackURL so tr
      accessType: "offline",
      prompt: "consent",
    },
    async function (accessToken, refreshToken, profile, done) {
      // if user exist I return this user
      const foundUserObject = await findUserInDbOrNull(profile._json.email); // use object like {id:25, name: 'Olga Orlova'}

      if (foundUserObject) {
        return done(null, foundUserObject);
      }
      return registerUser(accessToken, refreshToken, profile, done);
    }
  )
);

app.use("/api/auth/", authRouter);
app.use("/api/profile/", profileRouter);
app.use("/api/image/", imageRouter);
app.use("/api/article/", articleRouter);

passport.serializeUser(function (user: any, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user: any, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.get("/api/csrf-token", (req: Request, res: Response) => {
  const csrfToken = generateCsrfToken(req, res);
  res.json({ csrfToken: csrfToken });
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
})
