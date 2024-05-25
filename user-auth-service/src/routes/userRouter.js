const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const { validateRequest } = require("chordchat-common");

const userController = require("../controllers/userController");

//route to sign in
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid!!"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must enter a password!"),
  ],
  validateRequest,
  userController.signInUser
);

router.post("/api/users/signout", userController.signOutUser);

router.post("/api/users/generate-otp", userController.otpForUser);

router.post("/api/users/signup", userController.signUpUser);
module.exports = router;
