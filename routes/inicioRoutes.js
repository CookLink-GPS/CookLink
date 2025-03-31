const express = require("express");
const router = express.Router();
const inicioController = require("../controllers/inicioController");

router.get("/", inicioController.mostrarInicio);

module.exports = router;
