const { Router } = require("express");
const cookController = require("../controllers/cookController");
const { recipeRoutes } = require("../config/routes");


const router = Router();

// POST /cook/:id -> cocinar la receta con id
router.post(recipeRoutes.cook, cookController.cookRecipe);
router.post(recipeRoutes.addToShoppingList, cookController.addMissingToShoppingList);
module.exports = router;
