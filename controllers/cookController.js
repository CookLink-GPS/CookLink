const { ok, badRequest } = require("../config/httpcodes");
// Const cookService = require("../services/cookService");
const { renderView } = require("../middlewares/viewHelper");
const recipeService = require("../services/recipeService");

exports.cookRecipe = async (req, res) => {
	const userId = req.session.user.id;
	const recipeId = req.params.id;
	const usados = req.body.usados.map(ingredienteStr => {
		try {
			return JSON.parse(ingredienteStr);
		}
		catch (error) {
			console.error("Error parsing ingredient:", error);
			return null;
		}
	}).filter(ingrediente => ingrediente !== null);

	try {
		const result = await recipeService.cookRecipe({ userId, recipeId, suficientes: usados });
		const recipe = await recipeService.getRecipeById(recipeId);
		const ingredients = await recipeService.getIngredients(recipeId);
		recipe.ingredients = ingredients;

		renderView(res, "recipe-info", ok, {
			recipe,
			cocinar: true,
			usados: result.usados,
			mensajeExito: result.message
		});

	}
	catch (error) {
		console.error("Error al intentar cocinar la receta:", error);
		renderView(res, "recipe-info", badRequest, {
			recipe: null,
			mensajeError: "Error al intentar cocinar la receta."
		});
	}

};

exports.addMissingToShoppingList = async (req, res) => {
	const userId = req.session.user.id;
	const recipeId = req.params.id;
	const faltantes = req.body.faltantes.map(ingredienteStr => {
		try {
			return JSON.parse(ingredienteStr);
		}
		catch (error) {
			console.error("Error parsing ingredient:", error);
			return null;
		}
	}).filter(ingrediente => ingrediente !== null);

	try {
		const result = await recipeService.addMissingToShoppingList(userId, recipeId, faltantes);
		const recipe = await recipeService.getRecipeById(recipeId);
		const ingredients = await recipeService.getIngredients(recipeId);
		recipe.ingredients = ingredients;

		renderView(res, "recipe-info", ok, {
			recipe,
			cocinar: false,
			faltantes: result.faltantes,
			mensajeExito: result.message
		});
	}
	catch (error) {
		console.error("Error al intentar añadir ingredientes a la lista de la compra:", error);
		renderView(res, "recipe-info", badRequest, { mensajeError: "Error al intentar añadir ingredientes a la lista de la compra." });
	}
};
