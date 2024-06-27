const user = require("../models/user");
const OTP = require("../models/OTP");
const otpGenerator = require('otp-generator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const profile = require("../models/profile");
const mailSender = require("../utils/nodeMailer");
const passwordUpdate = require("../mail/template/passwordUpdate")
require("dotenv").config();

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const excitingUser = await user.findOne({ email });
    if (excitingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exits",
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("generated otp :-", otp);

    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "otp sent successfully",
      otpBody,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong while sending otp",
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const {
      Firstname,
      LastName,
      email,
      password,
      confirmPassword,
      contactNumber,
      otp,
      accountType,
    } = req.body;

    if (
      !Firstname ||
      !LastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !contactNumber ||
      !otp
    ) {
      return res.status(500).json({
        success: false,
        message: "please fill all the details",
      });
    }

    if (password !== confirmPassword) {
      return res.status(500).json({
        message: "password and confirm password does not match",
      });
    }

    const excitingUser = await user.findOne({ email });
    if (excitingUser) {
      return res.status(500).json({
        success: false,
        message: "user already exits",
      });
    }

    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOTP);

    if (recentOTP.length == 0) {
      return res.status(500).json({
        message: "please fill otp",
      });
    } 
    
    else if (recentOTP[0].otp !== otp) {
      return res.status(500).json({
        message: "invalid otp",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userProfile = await profile.create({
      gender: null,
      dateOfbirth: null,
      about: null,
    });

    const User = await user.create({
      Firstname,
      LastName,
      email,
      password: hashedPassword,
      accountType:accountType,
      contactNumber,
      Profile: userProfile._id,
    });

    console.log("user details", User);
  } catch (error) {
    console.log("signup error", error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({
        message: "please fill all the details",
      });
    }

    const User = await user.findOne({ email }).populate("Profile");
    if (!User) {
      return res.status(500).json({
        success: false,
        message: "pehle signup karke aao",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      (user.token = token), (user.password = undefined);

      const option = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("userToken", token, option).status(200).json({
        success: true,
        user,
        token,
        message: "User logged in Successfully",
      });
    } else {
      console.log("Error In Comparing Password");
      return res.status(500).json({
        success: false,
        message: "pasasword does not match",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "kuch gadbad hai",
    });
  }
};


exports.changePassword = async (req, res)=>{
    const {oldPassword , newPassword , confirmNewPassword} = req.body
     if (oldPassword == newPassword) {
        return res.status(500).json({
            message:"old password and new psssword cannot be same"
        })
     }
    if (newPassword !== confirmNewPassword) {
        return res.status(500).json({
            message:"new password does not match"
        })
    }

    const newhashedpassword = await bcrypt.hash(newPassword,10)


    const updatedPassword = await user.findOneAndUpdate({email:email,
                                                         password:newhashedpassword},
                                                         {new:true});

    console.log(updatedPassword)                                                     
}