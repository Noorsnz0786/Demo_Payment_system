const express = require("express");
const {
  newUser,
  loginUser,
  getAllUsers,
} = require("../controllers/userController");
const { authProtect } = require("../middleware/authProtect");

const router = express.Router();

router.post("/register", newUser);
router.post("/login", loginUser);
router.get("/allUsers", authProtect, getAllUsers);

module.exports = router; // Ensure this syntax exports the router directly
