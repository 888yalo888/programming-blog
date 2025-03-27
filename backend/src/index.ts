import express from "express";
import multer, { FileFilterCallback } from "multer";
import fs from "node:fs";
import { Pool } from "pg";
import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import { createAuthToken } from "@portive/auth";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import cookieSession from "cookie-session";
import connectPgSimple from "connect-pg-simple";
import { body, param, query, validationResult } from "express-validator";
import { ArticleRequest, QueryParams } from "./interfaces/interfaces";


const sessionValidator = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.passport) {
    res.status(401).send("You are not logged in");
    return;
  }
  next();
};
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

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "blog",
  password: process.env.POSTGRESQL_POOL_PASSWORD!,
  port: 5432,
});

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
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/image", express.static("uploads"));

const PORT = 3000;

app.use(passport.authenticate("session"));

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only images."));
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: multerFilter,
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback", //if authentication is successful it brings us to this callbackURLso tr
      accessType: "offline",
      prompt: "consent",
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(accessToken, refreshToken, profile);

      try {
        // if user exist I return this user
        const existingUser = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [profile._json.email]
        );

        if (existingUser.rows.length > 0) {
          const foundUserObject = {
            id: existingUser.rows[0].id,
            name: existingUser.rows[0].name,
          };

          return done(null, foundUserObject);
        }
      } catch (err) {
        return done(err);
      }

      try {
        //1-2 request tokens resource and check if token and profile.id exist
        const userProfileIdRefreshToken = await pool.query(
          "SELECT * FROM tokens WHERE profile_id = $1 AND refresh_token = $2",
          [profile.id, accessToken]
        );

        //3 if token is not found I create a user and return an error if its not successful
        if (userProfileIdRefreshToken.rows.length === 0) {
          const newUser = await pool.query(
            `INSERT INTO users (email, name, photo, google_id) 
                         VALUES ($1, $2, $3, $4) 
                         RETURNING id`, //return an object like {rows: [{id:1}]}
            [
              profile._json.email,
              profile._json.name, // name
              profile._json.picture, // photo URL
              accessToken,
            ]
          );
          //4 return error if not successful
          if (newUser.rows.length === 0) {
            return done("User can not be created", null);
          }

          //5 code keeps running if user creation was successful I create a record in tokens
          const newToken = await pool.query(
            "INSERT INTO tokens (access_token, refresh_token, profile_id) VALUES ($1, $2, $3) RETURNING * ",
            [accessToken, refreshToken, profile.id]
          );

          //6 returns an error if creation cant be completed
          if (newToken.rows.length === 0) {
            return done("Token can not be created", null);
          }

          //continue running if creation was successful
          const user = {
            id: newUser.rows[0].id,
            name: profile.displayName,
          };

          //8
          return done(null, user);
        } else {
          //9 if token was found I search user with id
          const foundUser = await pool.query(
            "SELECT * FROM users WHERE google_id = $1",
            [profile.id]
          );

          //10 user is not found
          if (foundUser.rows.length === 0) {
            return done("Use is not found", null);
          }

          //11 use is found then I return this user
          const foundUserObject = {
            id: foundUser.rows[0].id,
            name: profile.displayName,
          };

          done(null, foundUserObject);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.get(
  //front makes request to this endpoint meaning when a user presses sign in button it goes to this endpoint
  "/api/auth/google",
  passport.authenticate("google", {
    //it's using google passport strategy
    scope: ["email profile"],
  })
);

app.get(
  "/api/auth/google/callback", // token will be send to this route
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173",
    failureRedirect: "http://localhost:5173",
  })
);

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

app.post("/api/logout", sessionValidator, function (req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      res.status(400).send("Unable to log out");
    } else {
      res.status(200).send("Logged out successful");
    }
  });
});

app.get("/api/profile", sessionValidator, async function (req, res) {
  res.status(200).json({ user: req.session.passport!.user });
});

app.post(
  "/api/image",
  upload.single("image"),
  async (req, res): Promise<void> => {
    //uploads images and only images
    if (!req.file) {
      res.status(400).send("No image uploaded or file type is invalid.");
      return;
    }

    const savedImage = uuidv4();
    try {
      const originalImage = req.file.buffer;

      const resizedImage = `uploads/s-${savedImage}.jpeg`;
      const formattedImage = `uploads/l-${savedImage}.jpeg`;

      const metadata = await sharp(originalImage).metadata(); // returns info about uploaded pic like width heigh etc

      if (!metadata) {
        res.status(400).send("Your image is corrupted");
        return;
      }

      const originalWidth = metadata.width || 0;
      const originalHeight = metadata.height || 0;

      const halfWidth = Math.floor(originalWidth / 2);
      const halfHeigh = Math.floor(originalHeight / 2);

      await sharp(originalImage).toFormat("jpeg").toFile(formattedImage);

      await sharp(originalImage)
        .resize(halfWidth, halfHeigh)
        .toFormat("jpeg")
        .toFile(resizedImage);
    } catch (err) {
      console.error("Error processing image:", err);
      res.status(500).send("Error processing image");
    }

    const imageURL = `http://localhost:3000/api/image/l-${savedImage}.jpeg`;

    res.status(200).send(imageURL);
  }
);

app.post(
  "/api/article",
  sessionValidator,
  body("title").exists().isString().notEmpty(),
  body("text").exists().isString().notEmpty(),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.send({ errors: validationErrors.array() });
      return;
    }
    console.log(req.body);

    const { title, text, is_published } = req.body;

    try {
      const article = await pool.query(
        "INSERT INTO articles (title, text,is_published) VALUES ($1, $2, $3)",
        [title, text, is_published]
      );
      res.status(200).json(article.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "" });
    }

    res.json(req.file);
  }
);

app.get(
  "/api/article/:id",
  sessionValidator,
  param("id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("id must be an integer greater than 1"),
  async (req: ArticleRequest, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.send({ errors: validationErrors.array() });
      return;
    }

    const articleId = parseInt(req.params.id, 10);

    try {
      const postById = await pool.query(
        "SELECT title, text, id FROM articles WHERE id = $1",
        [articleId]
      );
      res.status(200).json(postById.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "error retrieving a post" });
    }
  }
);


app.get(
  "/api/articles",
  sessionValidator,
  query("pageNumber")
    .trim()
    .isInt({ min: 1 })
    .withMessage("Page number must be an integer greater than or equal to 1")
    .toInt(),
  query("resultsOnPage")
    .trim()
    .isInt({ min: 1 })
    .withMessage("Page number must be an integer greater than or equal to 1")
    .toInt(),
  async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.send({ errors: validationErrors.array() });
      return;
    }

    const { pageNumber, resultsOnPage } = req.query;
    let actualPageNumber: number = 1; //OFFSET// how many articles to skip
    let actualResultsOnPage: number = 5; //LIMIT//how many articles on the page

    //its not edge cases its converting pageNumber string to number and assigning it to actualPageNumber
    if (!!pageNumber && !isNaN(parseInt(pageNumber.toString()))) {
      //toString because it's ts and we have to make sure its a string first
      actualPageNumber = parseInt(pageNumber.toString());
    }

    if (!!resultsOnPage && !isNaN(parseInt(resultsOnPage.toString()))) {
      actualResultsOnPage = parseInt(resultsOnPage.toString());
    }

    try {
      const resultsCount = await pool.query(
        "SELECT COUNT(*) FROM articles WHERE is_published=true"
      );

      const allPublishedArticles = await pool.query(
        "SELECT title, id, comments_count, likes_count,created_at FROM articles WHERE is_published=true LIMIT $1 OFFSET $2",
        [actualResultsOnPage, actualResultsOnPage * (actualPageNumber - 1)]
      );

      res.status(200).json({
        page_results: allPublishedArticles.rows,
        page_info: {
          page_number: actualPageNumber,
          page_size: actualResultsOnPage,
          result_count: parseInt(resultsCount.rows[0].count), //number of articles
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "error retrieving articles" });
    }
  }
);

app.post(
  "/api/article/:id/comment",
  sessionValidator,
  param("id")
    .isInt({ min: 1 })
    .withMessage("Article id must be an integer greater than 0"),
  body("comment")
    .exists()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Comment must be a non-empty string"),
  async (req: ArticleRequest, res: Response) => {
    //console.log(req.body);
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.send({ errors: validationErrors.array() });
      return;
    }

    // if (!req.session.passport) {
    //   res.status(401).send("No session found");
    //   return;
    // }

    // const user_id = req.session.passport?.user.id ?? null;
    const user_id = req.body.user_id;
    const { comment } = req.body;
    const articleId = parseInt(req.params.id, 10);

    try {
      const commentResult = await pool.query(
        "INSERT INTO comments_info (user_id, article_id,comment) VALUES ($1, $2, $3)",
        [user_id, articleId, comment]
      );
      res.status(200).json(commentResult.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "" });
    }

    res.json(req.file);
  }
);

app.get(
  "/api/article/:id/comments",
  sessionValidator,
  param("id")
    .isInt({ min: 1 })
    .withMessage("Article id must be an integer greater than 0"),
  async (req: ArticleRequest, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.send({ errors: validationErrors.array() });
      return;
    }
    const articleId = parseInt(req.params.id, 10);

    try {
      const commentsById = await pool.query(
        "SELECT comment FROM comments_info WHERE article_id = $1",
        [articleId]
      );
      res.status(200).json(commentsById.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "error retrieving comments" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
