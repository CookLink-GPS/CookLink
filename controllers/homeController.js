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
exports.showHome = (req, res, next) => {
	try {
		renderView(res, "inicio", ok, { username: req.session.username } );
	}
	catch (err) {
		next(err);
	}
};
