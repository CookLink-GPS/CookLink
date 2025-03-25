const { ok } = require("../config/httpcodes");
const { renderView } = require("../middlewares/viewHelper");
const pantryService = require("../services/pantryService");

/**
 * Renderiza una vista con todos los ingredientes de la despensa del usuario
 *
 * @param {HTTPRequest} req
 * @param {HTTPResponse} res
 */
exports.getDespensa = async (req, res) => {
	const ingredients = await pantryService.getIngredientsDetails(req.session.user.id);
	renderView(res, "despensa", ok, { ingredients });
};
