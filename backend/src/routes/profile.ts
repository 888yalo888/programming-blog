import { Request, Response, Router } from "express";
import { sessionValidator } from "../middlewares/middlewares";
import { pool } from "../configs/pool";

const router = Router();

router.post(
  "/logout",
  sessionValidator,
  function (req: Request, res: Response, next) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send("Unable to log out");
      } else {
        res.status(200).send("Logged out successful");
      }
    });
  }
);

router.get("/", sessionValidator, async function (req, res) {
  // TODO go to db and collect information about user(name,id, role, picture) and pass it in response
  // TODO write and sql query with joins and collect the info about user

  const userQueryResult = await pool.query(
    "SELECT users.id, users.name, users.photo, roles.role FROM users LEFT JOIN user_roles ON users.id=user_roles.user_id LEFT JOIN roles ON user_roles.role_id=roles.id WHERE users.id=$1",
    [req.session.passport!.user.id]
  );
  //console.log('userInfoRole',userInfo.rows[0].role);

  res.status(200).json({ user: userQueryResult.rows[0] });
}); //session validator needed

export default router;
