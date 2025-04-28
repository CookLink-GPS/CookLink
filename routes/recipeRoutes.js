const { Router } = require("express");
const recipeController = require("../controllers/recipeController");
const { recipeRoutes } = require("../config/routes");
const ShoppingListController = require("../controllers/shoppingListController");
const router = Router();

router.get(recipeRoutes.recommendations, recipeController.getRecommendations);
router.get(recipeRoutes.recipeInfo, recipeController.getRecipeInfo);
router.post(recipeRoutes.cook, recipeController.cookRecipe);
router.post(recipeRoutes.addToShoppingList, ShoppingListController.addMissingToShoppingList);
// Router.post(recipeRoutes.check, recipeController.checkRecipe);
module.exports = router;
