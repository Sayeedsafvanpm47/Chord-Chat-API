const userService = require("../services/userService");
const {
  encryptPassword,
  decryptPassword,
} = require("../helpers/encryptPassword");
const jwt = require("jsonwebtoken");
const { BadRequestError } = require("chordchat-common");
const Otp = require("../models/otp-verify");
const generateOtp = require("../helpers/generateOtp");
const { sendMail } = require("../utils/sendMail");

//controller for sign in
const signInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const checkUser = await userService.findUser(email);
    if (!checkUser) throw new BadRequestError("User not found, sorry");
    const existingPass = checkUser.password;
    const decryptedPass = await decryptPassword(password, existingPass);
    if (decryptedPass) {
      const userDetails = { ...checkUser._doc };
      delete userDetails.password;
      console.log(userDetails);
      const userJWT = jwt.sign(userDetails, process.env.JWT_KEY);
      // req.session = {
      //   jwt : userJWT
      // }
      res.cookie("jwt", userJWT, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      return res
        .status(200)
        .json({ message: "success", data: userDetails, token: userJWT });
    } else {
      throw new BadRequestError("Invalid credentials");
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

//controller for signout
const signOutUser = async (req, res, next) => {
  try {
    req.session = null;
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      path: "/",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Some error occured" });
  }
};

//controller for otp generation and updation
const otpForUser = async (req, res) => {
  try {
    const email = req.body.email;

    const otp = await generateOtp();
    if (!email) throw new BadRequestError("Please enter an email!");
    await sendMail(email, otp).then((res) => console.log(res));
    let findOtp = await userService.findOtp(email);
    console.log(findOtp, "found otp");
    if (findOtp) {
      await userService.updateOtp(email, otp);
    } else {
      await userService.createOtp(email, otp);
    }
    return res.json({ message: "otp generated", otp, email });
  } catch (error) {}
};

//controller for sign up
const signUpUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      username,
      firstname,
      lastname,
      talent,
      enteredOtp,
    } = req.body;
    let otp;
    const verifyOtp = await userService.findOtp(email);

    if (verifyOtp) {
      otp = verifyOtp.otp;
    } else {
      throw new BadRequestError("Confirm the email in which the otp was sent!");
    }

    const emailExist = await userService.findUser(email);

    if (emailExist) {
      throw new BadRequestError("Email already exists");
    }

    const encryptedPassword = await encryptPassword(password);

    const signUpDetails = {
      email,
      password: encryptedPassword,
      username,
      firstname,
      lastname,
      talent,
    };

    if (enteredOtp == otp) {
      const newUser = await userService.signUpUser(signUpDetails);

      const userDetails = { ...newUser._doc };
      delete userDetails.password;

      const userJWT = jwt.sign(userDetails, process.env.JWT_KEY);
      // req.session = {
      //   jwt: userJWT
      // };
      res.cookie("jwt", userJWT, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await userService.deleteOtp(email)
      return res.status(201).json({
        message: "Otp Verification success, user registered successfully",
        data: userDetails,
      });
    } else {
      throw new BadRequestError("Otp verification failed!");
    }
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).json({ errors: [error.message] });
    } else {
      console.error("Unexpected error:", error);
      return res.status(500).json({ errors: ["An unexpected error occurred"] });
    }
  }
};

const passWordResetUser = async (req, res) => {
  try {
    const { email, enteredOtp, newPassword, confirmPassword } = req.body;
    const findOtp = await userService.findOtp(email);
    let otp;
    if (!findOtp)
      throw new BadRequestError("Confirm the email in which the otp was sent!");
    otp = findOtp.otp;
    console.log(otp, "otpfound");
    console.log(enteredOtp, "entered");
    if (otp == enteredOtp) {
      if (newPassword == confirmPassword) {
        const encryptedPassword = await encryptPassword(newPassword);
        console.log(encryptedPassword);
        const user = await userService.updatePassword(email,encryptedPassword)
        if (user) {
          console.log(user,'user deets')
          await userService.deleteOtp(email)
          res.json({ message: "Password changed successfully!" });
        } else {
          throw new BadRequestError("Something went wrong!");
        }
      } else {
        throw new BadRequestError("The passwords does not match");
      }
    } else {
      throw new BadRequestError("Otp verification failed!");
    }
  } catch (error) {
          res.json({errors:[error.message]})
           console.log(error.message)
  }
};


module.exports = {
  signInUser,
  signOutUser,
  signUpUser,
  otpForUser,
  passWordResetUser
};
