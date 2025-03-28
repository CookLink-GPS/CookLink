const express = require("express");
const router = express.Router();
const pantryController = require("../controllers/pantryController");

router.get("/", pantryController.showPantry);

router.post("/delete/:id_despensa", pantryController.deleteIngredient);


router.get("/search/", pantryController.searchIngredients);
router.get("/search/:filter", pantryController.searchIngredients);

module.exports = router;
