const express = require("express");
const router = express.Router();
const pantryController = require("../controllers/pantryController");

router.get("/", pantryController.showPantry);

router.post("/delete/:ingredientId", pantryController.deleteIngredient);

module.exports = router;
