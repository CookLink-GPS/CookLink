const { badRequest, internalServerError } = require("../config/httpcodes");
const Contains = require("../models/containsModel");
const Pantry = require("../models/pantryModel");
const Recipe = require("../models/recipeModel");
const AppError = require("../utils/AppError");
const { stringComparator } = require("../utils/stringFunctions");
const CERO = 0;

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
				const ingredients = await Contains.getIngredientsFromRecipe(recipeId);
				return { id: recipeId, nombre, descripcion, ingredientes: ingredients };
			}));

			return recipesWithIngredients.filter(({ ingredientes }) => {
				let quantity = 0;
				// Comprobar para cada ingrediente:
				ingredientes.forEach(({ id: ingredientId, unidades }) => {
					// Si esta en la despensa Y hay suficiente cantidad
					// Entonces añadimos 1 al total de ingredientes coincidentes
					if (pantryMap.has(ingredientId) && pantryMap.get(ingredientId).cantidad >= unidades) quantity++;

				});

				return quantity/ingredientes.length >= MIN_INGREDIENTS_RATIO; // Si hay al menos la mitad de ingredientes
			}).toSorted(({ nombre: nameA }, { nombre: nameB }) => stringComparator(nameA, nameB));
		}
		catch (error) {
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

			return ingredients.map(row => ({
				ingrediente: row.ingrediente,
				tipoUnidad: row.tipoUnidad ?? undefined,
				unidades: row.unidades
			}));
		}
		catch (error) {
			if (error.message === "No hay ingredientes") throw error;
			throw new AppError("Error al obtener los ingredientes", error);
		}
	},
	/**
	 * Cocina una receta restando ingredientes de la despensa
	 *
	 * @param {Object} params
	 * @param {Number} params.userId - ID del usuario
	 * @param {Number} params.recipeId - ID de la receta
	 * @returns {Promise<Object>} - Ingredientes usados o error si faltan
	 */
	async cookRecipe({ userId, recipeId, suficientes }) {
		if (!userId || !recipeId) throw new AppError("Faltan datos del usuario o de la receta", badRequest);

		try {
			for (const { id, unidades } of suficientes) {
				const existe = await Pantry.getPantryItemByIngredient(userId, id);
				if (existe) {
					const cantidad = parseFloat(existe.cantidad - unidades);
					if (cantidad <= 0) await Pantry.deleteIngredient(userId, id);
					else await Pantry.decreaseQuantity(userId, id, unidades);
				}
			}

			return {
				success: true,
				message: "¡Receta cocinada con éxito!",
				usados: suficientes
			};
		}
		catch (error) {
			console.error("[RecipeService] Error en cookRecipe:", error);
			throw new AppError("Error interno al cocinar la receta", internalServerError);
		}
	},
	/**
	 * Mira qué ingredientes tienes y cuáles te faltan para la receta
	 *
	 * @param {Number} userId - ID del usuario
	 * @param {Number} recipeId - ID de la receta
	 * @returns {Promise<{suficientes: Object[], faltantes: Object[]}>}
	 */
	async checkRecipeRequirements(userId, recipeId) {
		if (!userId || !recipeId) throw new AppError("Faltan datos del usuario o receta", badRequest);

		try {
			const pantry = await Pantry.getPantryFromUser(userId);
			const pantryMap = new Map(pantry.map(p => [ p.id_ingrediente, p.cantidad ]));
			const ingredientes = await Contains.getIngredientsFromRecipe(recipeId);

			const faltantes = [];
			const suficientes = [];

			for (const { id, nombre, unidades, tipoUnidad } of ingredientes) {
				const disponibles = pantryMap.get(id) || 0;

				if (disponibles >= unidades) suficientes.push({ id, nombre, unidades, tipoUnidad });
				 else faltantes.push({
					id,
					nombre,
					unidadesNecesarias: unidades - disponibles,
					tipoUnidad
				});

			}

			return { suficientes, faltantes };
		}
		catch (error) {
			throw new AppError("Error al comprobar los ingredientes", internalServerError);
		}
	}

};

module.exports = RecipeService;
