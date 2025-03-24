const ingredientService = require("../services/ingredientService");

const { renderView } = require("../middlewares/viewHelper"); // Importamos la función centralizada
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

exports.addIngredient = async (req, res) => {
	console.log(`Ingrediente controller${ req.body}`);
	try {

		await ingredientService.addIngredient(req.body);
		renderView(res, "ingredientes", ok, { mensajeExito: "Ingrediente añadido correctamente." });
	}
	catch (err) {
		// Next(err);
		renderView(res, "ingredientes", { mensajeError: "Error al añadir el ingrediente" });
	}
};

exports.filterIngredients = async (req, res) => {
	try {
		console.log("A");
		const ingredientes = await ingredientService.filterIngredients(req.params.filter);

		console.log(ingredientes);
		res.json({ ingredientes });
	}
	catch (err) {
		console.log(err);
		res.json({ mensajeError: "Error al filtrar los ingredientes" });
	}
};
