const ingredientService = require("../services/ingredientService");
const { renderView } = require("../middlewares/viewHelper");
const { ok } = require("../config/httpcodes");

/**
 * Redirige a la página de registro de usuario.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP que renderiza la vista de registro.
 * @param {Function} next - Función para manejar errores.
 */
exports.toIngredient = (req, res, next) => {
	try {
		renderView(res, "ingredientes", ok);
	}
	catch (err) {
		next(err);
	}
};

/**
 * Adds an ingredient.
 *
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 */
exports.addIngredient = async (req, res) => {
	console.log(`Ingrediente controller${ req.body}`);
	try {

		await ingredientService.addIngredient(req.body);
		renderView(res, "ingredientes", ok, { mensajeExito: "Ingrediente añadido correctamente." });
	}
	catch (err) {
		renderView(res, "ingredientes", { mensajeError: "Error al añadir el ingrediente" });
	}
};

/**
 *
 *
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 */
exports.filterIngredients = async (req, res) => {
	try {
		const ingredientes = await ingredientService.filterIngredients(req.params.filter || "");

		res.json({ ingredientes });
	}
	catch (err) {
		res.json({ mensajeError: "Error al filtrar los ingredientes" });
	}
};
