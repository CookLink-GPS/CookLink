const { ok } = require("../config/httpcodes");
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

exports.getRecipeInfo = async (req, res, next) => {
	try {
		const { id } = req.params;
		// ESTO EN EL MODEL
		// If (!id) return renderView(res, "recipe-info", badRequest, { mensajeError: "ID receta no encontrado." });

		const recipe = await RecipeService.getRecipeById(id);
		// If (!recipe) return renderView(res, "recipe-info", notFound, { mensajeError: "Receta no encontrada." });
		console.log(recipe);
		renderView(res, "recipe-info", ok, { recipe });
	}
	catch (err) {
		next(err);
	}
};
