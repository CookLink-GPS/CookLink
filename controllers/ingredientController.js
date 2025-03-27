const ingredientService = require("../services/ingredientService");
// Const { usuarioAutenticado } = require("../middlewares/userSession");
const { renderView } = require("../middlewares/viewHelper"); // Importamos la función centralizada
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

exports.addIngredient = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("Error details: ", JSON.stringify(errors.array(), null));
		return renderView(res, "ingredientes", badRequest, { mensajeError: errors.array() });
	}
	console.log("[Controller] Datos recibidos:", req.body);
	try {
		const { nombre, tipoUnidad, cantidad } = req.body;
		// Const userId = usuarioAutenticado.id; // Asumiendo autenticación
		const userId = 1;
		console.log(`[Controller] Procesando para usuario ${userId}`);

		// Procesar el ingrediente
		const result = await ingredientService.processIngredient({
			nombre,
			tipoUnidad,
			cantidad: parseFloat(cantidad),
			userId
		});

		console.log("[Controller] Resultado del servicio:", result);

		// Mensaje según la acción realizada
		const message = result.action === "updated"
			? `Cantidad actualizada a tu despensa de ${result.nombre}: ${result.cantidad} ${normalizarUnidad(result.tipoUnidad)}`
			: `Nuevo ingrediente: "${nombre}" añadido a tu despensa: ${cantidad} ${normalizarUnidad(tipoUnidad)}`;

		console.log(`[Controller] Enviando respuesta: ${message}`);

		renderView(res, "ingredientes", ok, {
			mensajeExito: message,
			// MensajeExito: result,
			formData: {} // Limpiar formulario
		});

	}
	catch (err) {
		console.error("[Controller] Error:", err);
		renderView(res, "ingredientes", err.status || badRequest, {
			mensajeError: err.message,
			formData: req.body // Mantener datos del formulario
		});
	}
};
