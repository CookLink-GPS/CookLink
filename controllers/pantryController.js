const { ok } = require("../config/httpcodes");
const { renderView } = require("../middlewares/viewHelper");
const pantryService = require("../services/pantryService");

/**
 * Renderiza una vista con todos los ingredientes de la despensa del usuario
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getDespensa = async (req, res) => {
	const ingredients = await pantryService.getIngredientsDetails(req.session.user.id);
	renderView(res, "despensa", ok, { ingredients });
};

/**
 * Devuelve una lista con los ingredientes a buscar
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.searchIngredients = async (req, res) => {
	try {
		const ingredientes = await pantryService.searchIngredients(req.params.filter || "", req.session.user.id);

		res.json({ ingredientes });
	}
	catch (err) {
		console.error(err.message);
		res.json({ mensajeError: "Error al filtrar los ingredientes" });
	}
};
