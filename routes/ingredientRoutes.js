const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");
const { check } = require("express-validator");
// Const AppError = require("../utils/AppError");
// Const { badRequest } = require("../config/httpcodes");


router.get("/", ingredientController.toIngredient);

router.post(
	"/add",
	check("nombre", "El nombre del ingrediente no puede contener números.").matches(/^[a-zA-Z\s]+$/), // Expresión regular que solo permite letras y espacios
	ingredientController.addIngredient
);

module.exports = router;
