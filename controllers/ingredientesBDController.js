const { ok } = require("../config/httpcodes");
const { renderView } = require("../middlewares/viewHelper");
const ingredientesBDService = require("../services/ingredientesBDService");


/**
 *
 * @param {HTTPRequest} req
 * @param {HTTPResponse} res
*/
exports.getIngredientsFromDatabase = async (req, res) => {
	const userId = req.session.user.id;

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
	const userId = req.session.user.id;
	try {
		const { ingredientes, cantidad } = req.body;

		const renderWithError = async mensajeError => {
			const ingredients = await ingredientesBDService.getAllIngredientsFromDatabase();
			const pantryIngredients = await ingredientesBDService.getIngredientsFromUserPantry(userId);

			return renderView(res, "ingredientesBD", ok, {
				ingredients,
				pantryIngredients,
				mensajeError
			});
		};

		if (!ingredientes || isNaN(ingredientes)) return await renderWithError("¡Seleccione un ingrediente válido!");

		if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) return await renderWithError("¡Seleccione una cantidad válida!");

		await ingredientesBDService.addIngredientIntoPantry(userId, ingredientes, cantidad);

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
		const pantryIngredients = await ingredientesBDService.getIngredientsFromUserPantry(userId);

		renderView(res, "ingredientesBD", ok, {
			ingredients,
			pantryIngredients,
			mensajeError: "Erro al añadir ingrediente a la despensa."
		});
	}
};

