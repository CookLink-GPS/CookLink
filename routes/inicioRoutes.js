// Routes/inicioRoutes.js
const express = require("express");
const router = express.Router();
const inicioController = require("../controllers/inicioController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// /despensa
router.get("/", authMiddleware, inicioController.mostrarInicio);

router.get("/despensa", authMiddleware, inicioController.getDespensa);

module.exports = router;
