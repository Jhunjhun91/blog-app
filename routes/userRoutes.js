const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// Register user controller
const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Validation
    if (!username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please Fill all fields",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const user = new userModel({ username, email, password: hashedPassword });
    await user.save();
    return res.status(201).send({
      success: true,
      message: "New User Created",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error In Register callback",
      success: false,
      error,
    });
  }
};

// Get all users controller
const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      userCount: users.length,
      success: true,
      message: "All users data",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Users",
      error,
    });
  }
};

// Login user controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "Please provide email or password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid username or password",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Login successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Login callback",
      error,
    });
  }
};

// Define routes
router.post("/register", registerController);
router.get("/users", getAllUsersController);
router.post("/login", loginController);

module.exports = router;
