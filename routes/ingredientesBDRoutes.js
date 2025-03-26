const { Router } = require("express");
const router = Router();
const ingredientesBD = require("../controllers/ingredientesBDController");

router.get("/", ingredientesBD.getIngredientsFromDatabase);
router.post("/addIngrediente", ingredientesBD.postIngredienteIntoPantry);

module.exports = router;
