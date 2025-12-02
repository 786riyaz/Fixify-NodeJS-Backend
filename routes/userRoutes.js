const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getMe,
  updateMe,
  getAllUsers,
  getUserById,
  deleteUser,
  changePassword,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", auth, getMe);
router.put("/me", auth, updateMe);

router.post("/change-password", auth, changePassword);

router.get("/all", auth, getAllUsers);
router.get("/:id", auth, getUserById);
router.delete("/:id", auth, deleteUser);

module.exports = router;
