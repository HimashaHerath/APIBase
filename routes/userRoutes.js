const express = require("express");
const {
  register,
  login,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/:id", authMiddleware, getUserById);
router.get("/", authMiddleware, getAllUsers);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
