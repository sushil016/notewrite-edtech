const user = require("../models/user");
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser")
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.userToken || req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      res.status(401).json({
        success: false,
        message: "token missing",
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded", decoded);
      req.user = decoded;
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "token missing or invalid",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      err: error,
      success: false,
      message: "something went wrong while fetching token",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      res.status(500).json({
        success: false,
        message: "You are not admin!",
      });
    }
    next();
  } catch (error) {
    res.staus(500).json({
      err: error,
      success: false,
      message: "Admin access Required",
    });
  }
};

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      res.status(403).json({
        success: false,
        message: "Student thodi na ho app",
      });
    }
    next();
  } catch (error) {
    res.staus(500).json({
      err: error,
      success: false,
      message: "Student access required",
    });
  }
};

exports.isTeacher = (req, rex, next) => {
  try {
    if (req.user.accountType !== Teacher) {
      return res.status(500).json({
        success: false,
        message: "you are not a teacher!!!",
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
