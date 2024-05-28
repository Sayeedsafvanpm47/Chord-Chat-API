const User = require("../models/user");
const Otp = require("../models/otp-verify");

const findUser = async (email) => {
  const findExistingUser = await User.findOne({ email: email });
  return findExistingUser;
};

const signUpUser = async (details) => {
  const newUser = new User(details);
  await newUser.save();
  return newUser;
};

const updatePassword = async (email, password) => {
  const findExistingUser = await User.findOne({ email: email });
  if (findExistingUser) {
    findExistingUser.password = password;
    await findExistingUser.save();
  }
  return findExistingUser;
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

const deleteOtp = async (email) => {
  const findExistingOtp = await Otp.findOne({ email: email });
  if (findExistingOtp) {
    findExistingOtp.otp = "";
    await findExistingOtp.save();
  }
  return findExistingOtp;
};

module.exports = {
  findUser,
  findOtp,
  updateOtp,
  createOtp,
  signUpUser,
  updatePassword,
  deleteOtp
};
