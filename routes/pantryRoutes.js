const express = require("express");
const router = express.Router();
const pantryController = require("../controllers/pantryController");

router.get("/", pantryController.getDespensa);

module.exports = router;
