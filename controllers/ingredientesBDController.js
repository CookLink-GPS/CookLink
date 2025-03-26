const { ok } = require("../config/httpcodes");
const { renderView } = require("../middlewares/viewHelper");
const ingredientesBDService = require("../services/ingredientesBDService");

const userId = 1;

/**
 *
 * @param {HTTPRequest} req
 * @param {HTTPResponse} res
 */
exports.getIngredientsFromDatabase = async (req, res) => {
	// Const userId = req.session?.user?.id;

	const ingredients = await ingredientesBDService.getAllIngredientsFromDatabase();
	const pantryIngredients = await ingredientesBDService.getIngredientsFromUserPantry(userId);

	renderView(res, "ingredientesBD", ok, { ingredients, pantryIngredients });
};


/**
 *
 * @param {HTTPRequest} req
 * @param {HTTPResponse} res
 */
exports.postIngredienteIntoPantry = async (req, res) => {
	try {
		// Const userId = req.session?.user?.id;

		const { ingredientes, dia, mes, anio, cantidad } = req.body;

		const partes = [ dia, mes, anio ].filter(Boolean);
		const caducidad = partes.join("/");

		await ingredientesBDService.addIngredientIntoPantry(userId, ingredientes, caducidad, cantidad);

		const ingredients = await ingredientesBDService.getAllIngredientsFromDatabase();
		const pantryIngredients = await ingredientesBDService.getIngredientsFromUserPantry(userId);

		renderView(res, "ingredientesBD", ok, {
			ingredients,
			pantryIngredients,
			mensajeExito: "Ingrediente añadido con éxito!"
		});
	}
	catch (error) {
		const ingredients = await ingredientesBDService.getAllIngredientsFromDatabase();

		renderView(res, "ingredientesBD", ok, {
			ingredients,
			mensajeError: [ { msg: "Erro al añadir ingrediente a la despensa." } ]
		});
	}
};
