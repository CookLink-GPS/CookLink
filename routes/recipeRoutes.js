const { Router } = require("express");
const recipeController = require("../controllers/recipeController");
const router = Router();

router.get("/", (req, res) => res.send("Recetas"));
router.get("/recommended", recipeController.getRecommendations);
router.get("/:id", recipeController.getRecipeInfo);

module.exports = router;
