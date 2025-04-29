const express = require("express");
const router = express.Router();
const ShoppingListController = require("../controllers/shoppingListController");
const { shoppingListRoutes } = require("../config/routes");

// Mostrar listado completo
router.get(shoppingListRoutes.show, ShoppingListController.showList);

// Formulario
router.get(shoppingListRoutes.add, ShoppingListController.showAddForm);

// Para ecribir datos para los CA
router.post(shoppingListRoutes.add, ShoppingListController.addIngredient);

// Marcar como comprado
router.post( shoppingListRoutes.bought, ShoppingListController.markAsBought);

module.exports = router;
