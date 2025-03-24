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
	// TODO pasar id del usuario actual
	// eslint-disable-next-line no-magic-numbers
	const ingredients = await pantryService.getIngredientsDetails(13);
	renderView(res, "despensa", ok, { ingredients });
};
