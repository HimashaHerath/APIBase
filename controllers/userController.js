const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

exports.register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      confirmPassword,
      role,
      profilePicture,
      bio,
    } = req.body;
    const newUser = new User({
      name,
      username,
      email,
      password,
      confirmPassword,
      role,
      profilePicture,
      bio,
    });
    await newUser.save();
    newUser.password = undefined;
    logger.info(`User registered: ${newUser._id}`);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      logger.warn(
        `User registration failed - duplicate email or username: ${email}`
      );
      res.status(400).json({ error: "Email or Username already exists" });
    } else {
      logger.error(`User registration failed: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      logger.warn(`Login failed - user not found: ${email}`);
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed - invalid credentials: ${email}`);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.password = undefined;
    logger.info(`User logged in: ${user._id}`);
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      logger.warn(`Get user failed - user not found: ${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }
    logger.info(`User retrieved: ${user._id}`);
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Get user failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    logger.info(`All users retrieved, count: ${users.length}`);
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Get all users failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      role,
      profilePicture,
      status,
      bio,
    } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      logger.warn(`Update user failed - user not found: ${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }

    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;
    if (profilePicture) user.profilePicture = profilePicture;
    if (status) user.status = status;
    if (bio) user.bio = bio;

    await user.save();
    user.password = undefined;
    logger.info(`User updated: ${user._id}`);
    res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      logger.warn(`Update user failed - duplicate email or username: ${email}`);
      res.status(400).json({ error: "Email or Username already exists" });
    } else {
      logger.error(`Update user failed: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      logger.warn(`Delete user failed - user not found: ${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }
    logger.info(`User deleted: ${user._id}`);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    logger.error(`Delete user failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
