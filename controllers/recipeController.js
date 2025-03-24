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

exports.getRecipeInfo = async (req, res) => {
	const { id } = req.params;
	const recipe = await recipeService.getRecipeById(id);
	const listIngredients = await recipeService.getIngredients(id);
	recipe.ingredients = listIngredients;
	renderView(res, "recipe-info", ok, { recipe });
};
