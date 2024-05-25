const User = require("../models/user");
const Otp = require("../models/otp-verify");

const findUser = async (email) => {
  const findExistingUser = await User.findOne({ email: email });
  return findExistingUser;
};

const signUpUser = async (details) => {
          const newUser = new User(details)
          await newUser.save()
          return newUser

};

const findOtp = async (email) => {
  const findExistingOtp = await Otp.findOne({ email: email });
  return findExistingOtp;
};

const updateOtp = async (email, otp) => {
  const findExistingOtp = await Otp.findOne({ email: email });
  if (findExistingOtp) {
    findExistingOtp.otp = otp;
    await findExistingOtp.save();
  }

  return findExistingOtp;
};

const createOtp = async (email, otp) => {
  const createNewOtp = new Otp({ email, otp });
  await createNewOtp.save();
  return createNewOtp;
};

module.exports = {
  findUser,
  findOtp,
  updateOtp,
  createOtp,
  signUpUser
};
