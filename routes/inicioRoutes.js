const express = require("express");
const router = express.Router();
const inicioController = require("../controllers/inicioController");
const { inicioRoutes } = require("../config/routes");

router.get(inicioRoutes.show, inicioController.mostrarInicio);

module.exports = router;
