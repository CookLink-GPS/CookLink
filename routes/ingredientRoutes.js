const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");
// Const { check } = require("express-validator");
// Const AppError = require("../utils/AppError");
// Const { badRequest } = require("../config/httpcodes");


router.get("/", ingredientController.toIngredient);

router.post("/add", ingredientController.addIngredient);

router.get("/filter/", ingredientController.filterIngredients);
router.get("/filter/:filter", ingredientController.filterIngredients);

module.exports = router;
