const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");
const { ingredientRoutes } = require("../config/routes");

router.get(ingredientRoutes.toIngredient, ingredientController.toIngredient);

router.post(ingredientRoutes.add, ingredientController.addIngredient);

router.get(ingredientRoutes.addBD, ingredientController.getIngredientsFromDatabase);
router.post(ingredientRoutes.addBD, ingredientController.postIngredienteIntoPantry);

// CHECK igual podemos usarlo en un futuro
// Router.get("/filter", ingredientController.filterIngredients);
// Router.get("/filter/:filter", ingredientController.filterIngredients);

module.exports = router;
