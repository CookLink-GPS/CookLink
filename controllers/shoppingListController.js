const UNITS = require("../config/units");
const ShoppingListService = require("../services/shoppingListService");
const { ok, badRequest } = require("../config/httpcodes");
const AppError = require("../utils/AppError");
const { renderView } = require("../middlewares/viewHelper");
const { shoppingListRoutes } = require("../config/routes");

const ShoppingListController = {
	/** Muestra el formulario */
	showAddForm(req, res) {
		renderView(res, "shoppingListAdd", ok, { units: UNITS });
	},

	/** Procesa el POST de añadir ingrediente */
	async addIngredient(req, res) {
		try {
			const userId = req.session.user.id;
			const { nombre, cantidad, unidad } = req.body;
			await ShoppingListService.addIngredient(userId, nombre, cantidad, unidad, UNITS);
			res.redirect(shoppingListRoutes.default);
		}
		catch (err) {
			// Si es error de validación, mostramos el formulario con mensaje
			if (err instanceof AppError) return renderView(res, "shoppingListAdd", err.status, {
				error: err.message,
				old: req.body,
				units: UNITS
			});

			// Otros errores
			console.error(err);
			renderView(res, "error", badRequest, { error: "Error al procesar la petición." });
		}
	}
};

module.exports = ShoppingListController;
