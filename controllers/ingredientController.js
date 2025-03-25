const ingredientService = require("../services/ingredientService");
// Const { usuarioAutenticado } = require("../middlewares/userSession");
const { renderView } = require("../middlewares/viewHelper"); // Importamos la función centralizada
const { ok, badRequest } = require("../config/httpcodes");

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
			cantidad: parseInt(cantidad, 10),
			userId
		});

		console.log("[Controller] Resultado del servicio:", result);

		// Mensaje según la acción realizada
		const message = result.action === "updated"
			? `Cantidad actualizada: ${result.cantidad} ${result.ingrediente.tipoUnidad}`
			: `"${nombre}" añadido a tu despensa: ${cantidad} ${tipoUnidad}`;

		console.log(`[Controller] Enviando respuesta: ${message}`);

		renderView(res, "ingredientes", ok, {
			mensajeExito: message,
			// MensajeExito: result,
			formData: {} // Limpiar formulario
		});

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
