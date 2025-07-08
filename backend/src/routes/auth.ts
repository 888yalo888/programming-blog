import { Router } from 'express';
import passport from 'passport';
import "../interfaces/interfaces";

const router = Router();

router.get(
  //front makes request to this endpoint meaning when a user presses sign in button it goes to this endpoint
  "/google",
  passport.authenticate("google", {
    //it's using google passport strategy
    scope: ["email profile"],
  })
);

router.get(
  "/google/callback", // token will be send to this route
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173",
    failureRedirect: "http://localhost:5173",
  })
);


export default router;