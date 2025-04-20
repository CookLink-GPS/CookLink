const { ok, badRequest } = require("../config/httpcodes");
const { renderView } = require("../middlewares/viewHelper");
const recipeService = require("../services/recipeService");

/**
 * Renderiza una vista con todas las recetas de la aplicacion
 *
 * @param {HTTPRequest} req
 * @param {HTTPResponse} res
 */
exports.getAllRecipes = async (req, res) => {
	const recipes = await recipeService.getAllRecipes();
	renderView(res, "recommendations", ok, { recipes });
};

/**
 * Renderiza una vista con las recetas recomendadas del usuario con sesion activa
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getRecommendations = async (req, res) => {
	const recipes = await recipeService.getRecommendations({ id: req.session.user.id });
	renderView(res, "recommendations", ok, { recipes });
};

/**
 * Renderiza una vista con la informacion basica de una receta
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getRecipeInfo = async (req, res) => {
	const { id } = req.params;
	const userId = req.session.user.id;
	try {
		const result = await recipeService.checkRecipeRequirements( userId, id );
		const recipe = await recipeService.getRecipeById(id);
		const listIngredients = await recipeService.getIngredients(id);
		recipe.ingredients = listIngredients;
		if (result.faltantes.length === 0) renderView(res, "recipe-info", ok, {
			recipe,
			success: true,
			cocinar: true,
			mensajeExito: result.message,
			usados: result.suficientes
		});
		else renderView(res, "recipe-info", ok, {
			recipe,
			success: true,
			cocinar: false,
			faltantes: result.faltantes,
			mensajeError: result.message
		});
	}
	catch (error) {
		console.error("Error al intentar verificar la receta:", error);
		renderView(res, "recipe-info", badRequest, {
			recipe: null,
			success: false,
			cocinar: false,
			mensajeError: "Error al intentar verificar la receta."
		});
	}
};
