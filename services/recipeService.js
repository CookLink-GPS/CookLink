const { badRequest, internalServerError } = require("../config/httpcodes");
const Contains = require("../models/containsModel");
const Pantry = require("../models/pantryModel");
const Recipe = require("../models/recipeModel");
const AppError = require("../utils/AppError");
const { stringComparator } = require("../utils/stringFunctions");
const CERO = 0;

/**
 *
 * @typedef Recipe
 * @property {Number} id
 * @property {String} nombre
 * @property {String} descripcion
 *
 */
const RecipeService = {

	/**
     * Returns all recipes in the application
     *
     * @returns {Promise<Recipe[]>} - Array containing all the recipes
     */
	getAllRecipes() {
		return Recipe.getAllRecipes();
	},


	/**
     * Returns all the recipes that a user can cook with the ingredients
     * on his pantry
     *
     * @async
     * @param {Object} user - User that wants the recommendations
     * @param {Number} id - ID of said user
     * @returns {Promise<Recipe[]>} - Recommendations
     */
	async getRecommendations({ id }) {
		if (!id) throw new AppError("No hay id", badRequest);

		try {
			const allRecipes = await Recipe.getAllRecipes();
			const pantry = await Pantry.getPantryFromUser(id);

			// Usando un Map para busquedas constantes
			const pantryMap = new Map(pantry.map(({ id_ingrediente: ingredientId, cantidad }) => [ ingredientId, { cantidad } ]));

			const recipesWithIngredients = await Promise.all(allRecipes.map(async ({ id: recipeId, nombre, descripcion }) => {
				const ingredients = await Contains.getFromRecipe(recipeId);
				return { id: recipeId, nombre, descripcion, ingredients };
			}));

			return recipesWithIngredients.filter(({ ingredients }) => {
				let ok = true;

				// Comprobar para cada ingrediente:
				ingredients.every(({ id_ingrediente: ingredientId, unidades }) => {
					// Que esta en la despensa Y que hay suficiente cantidad
					ok = ok &&
                              (pantryMap.has(ingredientId) && pantryMap.get(ingredientId).cantidad > unidades);
				});

				return ok;
			}).sort(({ nombre: nameA }, { nombre: nameB }) => stringComparator(nameA, nameB));
		}
		catch (error) {
			console.log(error);
			throw new AppError("Error interno del servidor", internalServerError);
		}
	},
	/**
     * Returns a recipe by its ID
     *
     * @param {Number} id
     * @returns {Promise<Recipe>}
     */
	async getRecipeById(id) {
		if (!id) throw new AppError("No hay id", badRequest);

		try {
			const recipe = await Recipe.getRecipeById(id);
			if (!recipe) throw new AppError("Receta no encontrada", badRequest);
			return recipe;
		}
		catch (error) {
			if (error.message === "Receta no encontrada") throw error;

			console.error(error);
			throw new AppError("Error al obtener la receta", error);
		}
	},

	/**
     * Returns all ingredients for a given recipe
     *
     * @param {Number} id
     * @returns {Promise<Object[]>}
     */
	async getIngredients(id) {
		if (!id) throw new AppError("No hay id", badRequest);
		try {
			const ingredients = await Recipe.getIngredients(id);
			if (!ingredients || ingredients.length === CERO) throw new AppError("No hay ingredientes", badRequest);
			return ingredients;
		}
		catch (error) {
			if (error.message === "No hay ingredientes") throw error;

			console.error(error);
			throw new AppError("Error al obtener los ingredientes", error);
		}
	}
};

module.exports = RecipeService;
