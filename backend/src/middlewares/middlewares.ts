import { NextFunction, Request, Response } from "express";
import { pool } from "../configs/pool";
import { FileFilterCallback } from "multer";
import { VerifyFunction } from "passport-google-oauth";

export const sessionValidator = (req: Request, res: Response, next: NextFunction) => {
  console.log("Session Data:", req.session.passport);
  if (!req.session.passport) {
    res.status(401).send("You are not logged in");
    return;
  }
  next();
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  console.log("isAdmin function entered", req.session.passport);
  const userId = req.session.passport?.user.id;

  try {
    // TODO join role table with user_roles by user_id and get role from there
    const userFromRoles = await pool.query(
      "SELECT * FROM user_roles WHERE user_id = $1",
      [userId]
    );
    console.log("userFromRoles", userFromRoles);

    if (userFromRoles.rows.length === 0) {
      // User has no roles
      res.status(403).send("Forbidden: You do not have any roles");
      return;
    }

    const roleId = userFromRoles.rows[0].role_id;

    // TODO check not a number but an actual word ADMIN
    if (roleId !== 2) {
      res.status(403).send("Forbidden: You do not have admin privileges");
      return;
    }
    next();
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
};

export const multerFilter = (
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

export const findUserInDbOrNull = async (email: string) => {
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    //console.log('existingUser:', existingUser)

    if (existingUser.rows.length > 0) {
      return {
        id: existingUser.rows[0].id,
        name: existingUser.rows[0].name,
      };
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const registerUser = async (
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: VerifyFunction
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    //1 if user is not found I create and insert a new user into the table
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
    //2 return error if not successful
    if (newUser.rows.length === 0) {
      await client.query("ROLLBACK");
      return done("User can not be created", null);
    }
    //3  code keeps running if user creation was successful I create a record in tokens
    const newToken = await pool.query(
      "INSERT INTO tokens (access_token, refresh_token, profile_id) VALUES ($1, $2, $3) RETURNING * ",
      [accessToken, refreshToken, profile.id]
    );

    //4 returns an error if creation cant be completed
    if (newToken.rows.length === 0) {
      await client.query("ROLLBACK");
      return done("Token can not be created", null);
    }

    //5 continue running if creation was successful
    const user = {
      id: newUser.rows[0].id,
      name: profile.displayName,
    };

    //6 if user creation was successful and token was successfully created in db then I can add a role to a user
    const newUserRole = await pool.query(
      "INSERT INTO user_roles (role_id, user_id) VALUES ($1, $2) RETURNING * ",
      [1, newUser.rows[0].id]
    );

    //7 returns an error if creation cant be completed
    if (newUserRole.rows.length === 0) {
      await client.query("ROLLBACK");
      return done("Role can not be created", null);
    }
    //8 returns final user
    await client.query("COMMIT");
    return done(null, user);
  } catch (err) {
    await client.query("ROLLBACK");
    return done(err);
  } finally {
    console.log("finally entered and executed");
    client.release();
  }
};

