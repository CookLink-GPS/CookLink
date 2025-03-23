const express = require("express");
const router = express.Router();
const inicioController = require("../controllers/inicioController");

router.get("/", inicioController.getDespensa);

module.exports = router;
