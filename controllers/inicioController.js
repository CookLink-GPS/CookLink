// Controllers/inicioController.js
const { renderView } = require("../middlewares/viewHelper");
const { ok } = require("../config/httpcodes");

/**
 * Renderiza la vista de inicio.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP que renderiza la vista de inicio.
 * @param {Function} next - Función para manejar errores.
 */
exports.mostrarInicio = (req, res, next) => {
	try {
		renderView(res, "inicio", ok);
	}
	catch (err) {
		next(err);
	}
};

/**
 * Renderiza la vista de la despensa.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP que renderiza la vista de la despensa.
 * @param {Function} next - Función para manejar errores.
 */
exports.getDespensa = (req, res, next) => {
	try {
		const ingredientes = [
			"Harina",
			"Azúcar",
			"Sal",
			"Aceite de oliva",
			"Pimienta",
			"Huevos",
			"Hueso"
		];
		res.render("despensa", { ingredientes });
	}
	catch (err) {
		next(err);
	}
};
