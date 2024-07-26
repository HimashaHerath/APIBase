const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Email or Username already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.password = undefined;
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
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
      console.log("User not found");
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
    res.status(200).json(user);
  } catch (error) {
    console.log("Error:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Email or Username already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
