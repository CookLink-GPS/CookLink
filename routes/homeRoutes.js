const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const { homeRoutes } = require("../config/routes");

router.get(homeRoutes.show, homeController.showHome);

module.exports = router;
