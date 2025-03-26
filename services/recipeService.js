const { badRequest, internalServerError } = require("../config/httpcodes");
const Contains = require("../models/containsModel");
const Pantry = require("../models/pantryModel");
const Recipe = require("../models/recipeModel");
const AppError = require("../utils/AppError");
const { stringComparator } = require("../utils/stringFunctions");

const MIN_INGREDIENTS_RATIO = 0.5;

/**
 *
 * @typedef Recipe
 * @property {Number} id
 * @property {String} nombre
 * @property {String} descripcion
 *
 * @typedef RecipeIngredient
 * @property {Number} id
 * @property {String} nombre
 * @property {Number} unidades
 * @property {String} tipoUnidad
 *
 * @typedef RecipeWithIngredients
 * @property {Number} id
 * @property {String} nombre
 * @property {String} descripcion
 * @property {RecipeIngredient[]} ingredientes
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
				return { id: recipeId, nombre, descripcion, ingredientes: ingredients };
			}));

			return recipesWithIngredients.filter(({ ingredientes }) => {
				let quantity = 0;
				// Comprobar para cada ingrediente:
				ingredientes.forEach(({ id: ingredientId, unidades }) => {
					// Si esta en la despensa Y hay suficiente cantidad
					// Entonces añadimos 1 al total de ingredientes coincidentes
					quantity += pantryMap.has(ingredientId) && pantryMap.get(ingredientId).cantidad > unidades;
				});

				return quantity/ingredientes.length >= MIN_INGREDIENTS_RATIO; // Si hay al menos la mitad de ingredientes
			}).toSorted(({ nombre: nameA }, { nombre: nameB }) => stringComparator(nameA, nameB));
		}
		catch (error) {
			console.log(error);
			throw new AppError("Error interno del servidor", internalServerError);
		}
	}
};

module.exports = RecipeService;
