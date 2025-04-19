const { ok, badRequest } = require("../config/httpcodes");
// Const cookService = require("../services/cookService");
const { renderView } = require("../middlewares/viewHelper");
const recipeService = require("../services/recipeService");

exports.cookRecipe = async (req, res) => {
	const userId = req.session.user.id;
	const recipeId = req.params.id;

	try {
		const result = await recipeService.cookRecipe({ userId, recipeId });
		const recipe = await recipeService.getRecipeById(recipeId);
		const ingredients = await recipeService.getIngredients(recipeId);
		recipe.ingredients = ingredients;
		console.log("Resultado de cocinar receta:", result);
		console.log("Receta:", recipe);
		req.session.recipeData = result.recipe || null;

		if (result.success) renderView(res, "recipe-info", ok, {
			recipe,
			usados: result.usados,
			mensajeExito: result.message
		});
		else renderView(res, "recipe-info", ok, {
			recipe,
			faltantes: result.faltantes,
			mensajeError: result.message
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
