// Routes/inicioRoutes.js
const express = require("express");
const router = express.Router();
const inicioController = require("../controllers/inicioController");

// /despensa
router.get("/", inicioController.mostrarInicio);

router.get("/despensa", inicioController.getDespensa);

module.exports = router;
