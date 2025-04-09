const express = require("express");
const router = express.Router();
const pantryController = require("../controllers/pantryController");
const { pantryRoutes } = require("../config/routes");

router.get(pantryRoutes.show, pantryController.showPantry);

router.post(pantryRoutes.deleteIngredient, pantryController.deleteIngredient);


router.get(pantryRoutes.searchAll, pantryController.searchIngredients);
router.get(pantryRoutes.search, pantryController.searchIngredients);


module.exports = router;
