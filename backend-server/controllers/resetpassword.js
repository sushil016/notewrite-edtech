const user = require("../models/user");
const mailSender = require("../utils/nodeMailer");
const bcrypt = require("bcrypt");

exports.resetPasswordtoken = async (req, res) => {
  try {
    const email = req.body.email;

    const User = await user.findOne({ email: email });
    if (!User) {
      return res.status(500).json({
        success: false,
        message: "user is not registered ",
      });
    }

    const token = crypto.randomUUID();

    const updatedDetails = await user.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    const url = `https://localhost:3000/reset-password/${token}`;

    await mailSender(
      email,
      "reset password link",
      `click here to reset password${url}`
    );

    return res.status(200).json({
      message: "mail sent successfully",
    });
  } catch (error) {
    console.log("error while reseting password", error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(500).json({
        message: "password and confirm password does not match",
      });
    }

    const userDetails = await user.findOne({ token: token });
    if (!userDetails) {
      return res.status(500).json({
        message: "user token missing",
      });
    }

    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(500).json({
        message: "regenarate the token ",
        success: false,
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    await user.findOneAndUpdate(
      { token: token },
      { password: hashedpassword },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "reset password successful",
    });
  } catch (error) {
    console.log("error while reseting password");
  }
};
