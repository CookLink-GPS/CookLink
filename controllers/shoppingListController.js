const UNITS = require("../config/units");
const ShoppingListService = require("../services/shoppingListService");
const { ok, badRequest } = require("../config/httpcodes");
const AppError = require("../utils/AppError");
const { renderView } = require("../middlewares/viewHelper");
const { shoppingListRoutes } = require("../config/routes");

const ShoppingListController = {
	/** Muestra el formulario */
	showAddForm(req, res) {
		renderView(res, "shoppingListAdd", ok, { units: UNITS, formData: {} });
	},

	/** Procesa el POST de añadir ingrediente */
	async addIngredient(req, res) {
		try {
			const userId = req.session.user.id;
			const { nombre, cantidad, unidad } = req.body;
			await ShoppingListService.addIngredient(userId, nombre, cantidad, unidad, UNITS);
			// Res.redirect(shoppingListRoutes.default);
			renderView(res, "shoppingListAdd", ok, {
				mensajeExito: `Ingrediente "${nombre}" añadido a la lista de la compra: ${cantidad} ${unidad}`,
				formData: {}
			});
		}
		catch (err) {
			const mensajeError = {};

			if (err.message.toLowerCase().includes("ingrediente")) mensajeError.nombre = err.message;

			if (err.message.toLowerCase().includes("unidad")) mensajeError.unidad = err.message;
			if (err.message.toLowerCase().includes("cantidad")) mensajeError.cantidad = err.message;

			if (Object.keys(mensajeError).length === 0) mensajeError.general = err.message;

			// Si es error de validación, mostramos el formulario con mensaje
			if (err instanceof AppError) return renderView(res, "shoppingListAdd", err.status, {
				mensajeError,
				old: req.body,
				units: UNITS,
				formData: req.body
			});

			// Otros errores
			console.error(err);
			renderView(res, "error", badRequest, { mensajeError: "Error al procesar la petición.", formData: req.body });
		}
	}
};

module.exports = ShoppingListController;
