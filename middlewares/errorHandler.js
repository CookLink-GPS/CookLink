const { internalServerError } = require("../config/httpcodes");

/**
 * Middleware para manejar errores en la aplicación.
 *
 * @param {Object} err - Objeto de error que contiene el mensaje y el código de estado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP que renderiza la vista de error.
 */
module.exports = (err, req, res) => {
	console.error(err.stack);
	res.status(err.status || internalServerError).render("error", {
		error: err.message || "Error interno del servidor",
		status: err.status || internalServerError
	});
};
