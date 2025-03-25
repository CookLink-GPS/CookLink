// Routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Registro de usuario
router.post("/register", registerUser);

// Inicio de sesión
router.post("/login", loginUser);

// Cierre de sesión
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
