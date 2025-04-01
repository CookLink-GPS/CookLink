const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");

router.get("/", ingredientController.toIngredient);

router.post("/add", ingredientController.addIngredient);

router.get("/filter", ingredientController.filterIngredients);
router.get("/filter/:filter", ingredientController.filterIngredients);

module.exports = router;
