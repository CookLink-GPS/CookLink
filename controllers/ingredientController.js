const ingredientService = require("../services/ingredientService");
// Const { usuarioAutenticado } = require("../middlewares/userSession");
const { renderView } = require("../middlewares/viewHelper");
const { ok, badRequest } = require("../config/httpcodes");
const { normalizarUnidad } = require("../utils/normalizarUnidad");
const { validationResult } = require("express-validator");

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
 * Añade un ingrediente.
 *
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 */
exports.addIngredient = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return renderView(res, "ingredientes", badRequest, { mensajeError: errors.msg });

	try {
		const { nombre, tipoUnidad, cantidad } = req.body;
		const ingrediente = { nombre, tipoUnidad };
		const userId = req.session.user.id; // Asumiendo autenticación

		const result = await ingredientService.processIngredient({
			ingrediente,
			cantidad: parseFloat(cantidad),
			userId
		});

		const message = result.action === "updated"
			? `Cantidad actualizada a tu despensa de ${result.ingrediente.nombre}: ${result.cantidad} ${normalizarUnidad(result.ingrediente.tipoUnidad)}`
			: `Nuevo ingrediente: "${ingrediente.nombre}" añadido a tu despensa: ${cantidad} ${normalizarUnidad(ingrediente.tipoUnidad)}`;

		renderView(res, "ingredientes", ok, {
			mensajeExito: message,
			formData: {}
		});

	}
	catch (err) {
		renderView(res, "ingredientes", badRequest, { mensajeError: err.message, formData: {} });
	}
};

/**
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
