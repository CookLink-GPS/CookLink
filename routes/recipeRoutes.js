const { Router } = require("express");
const recipeController = require("../controllers/recipeController");
const { recipeRoutes } = require("../config/routes");
const router = Router();

router.get(recipeRoutes.recommendations, recipeController.getRecommendations);
router.get(recipeRoutes.recipeInfo, recipeController.getRecipeInfo);
// Router.post(recipeRoutes.check, recipeController.checkRecipe);
module.exports = router;
