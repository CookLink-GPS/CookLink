const express = require("express");
const path = require("node:path");
const { indexRoutes } = require("../config/routes");
const router = express.Router();


router.get(indexRoutes.index, (req, res) => {
	res.render("index");
});

router.get(indexRoutes.favicon, (req, res) => {
	res.sendFile(path.join(__dirname, "../public/img/Logo.ico"));
});


module.exports = router;
