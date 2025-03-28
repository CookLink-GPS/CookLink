const Pantry = require("../models/pantryModel");
const Ingredient = require("../models/ingredientModel");
const { badRequest, internalServerError } = require("../config/httpcodes");
const AppError = require("../utils/AppError");
const { removeAccents } = require("../utils/stringFunctions");


/**
 *
 * @typedef IngredientQuantity
 * @property {Number} Id
 * @property {String} nombre
 * @property {String} tipoUnidad
 * @property {Number} cantidad
 *
 */
const PantryService = {
	/**
     * Retrieves all ingredients from a user's pantry.
     *
     * @async
     * @param {Number} userId - User ID.
     * @returns {Promise<Array>} - List of ingredients in the pantry.
     * @throws {AppError} - If the user ID is missing.
     */
	async getPantryIngredients(userId) {
		if (!userId) throw new AppError("User ID is required", badRequest);

		try {
			const ingredients = await Pantry.getPantryFromUser(userId);
			return ingredients;
		}
		catch (error) {
			console.error(error);
			throw new AppError("Error fetching pantry", internalServerError);
		}
	},

	/**
     * Retrieves all ingredients with their name and unit type
     * from a user's pantry.
     *
     * @async
     * @param {Number} userId - User ID.
     * @returns {Promise<Array>} - List of ingredients in the pantry.
     * @throws {AppError} - If the user ID is missing.
     */
	async getIngredientsDetails(userId) {
		if (!userId) throw new AppError("User ID is required", badRequest);

		try {
			const ingredients = await Pantry.getIngredientsDetails(userId);
			return ingredients;
		}
		catch (error) {
			console.error(error);
			throw new AppError("Error fetching pantry", internalServerError);
		}
	},

	/**
     * Deletes an ingredient from a user's pantry.
     *
     * @async
     * @param {Number} userId - User ID.
     * @param {Number} ingredientId - Ingredient ID to delete.
     * @returns {Promise<void>}
     * @throws {AppError} - If the user ID or ingredient ID is missing.
     */
	async deleteIngredient(userId, id_despensa, quantityToDelete) {
		if (!userId || !id_despensa || !quantityToDelete) throw new AppError("Missing required data", badRequest);

		const ERROR = 403;
		try {
			// Primero obtenemos el item de la despensa
			const pantryItem = await Pantry.getPantryItemById(id_despensa);

			if (!pantryItem) throw new AppError("Item not found in pantry", badRequest);


			if (pantryItem.id_usuario !== userId) throw new AppError("Unauthorized operation", ERROR);


			if (quantityToDelete > pantryItem.cantidad) throw new AppError("Cannot delete more than available quantity", badRequest);


			if (quantityToDelete === pantryItem.cantidad) await Pantry.deleteIngredient(userId, pantryItem.id_ingrediente);
			 else await Pantry.updateIngredientQuantity(id_despensa, pantryItem.cantidad - quantityToDelete);

		}
		catch (error) {
			console.error(error);
			throw new AppError("Error deleting ingredient", internalServerError);
		}
	},

	/**
	 *
	 * @async
	 * @param {String} search
	 * @param {Number} userId
	 * @returns {Promise<IngredientQuantity[]>}
	 *
	 */
	async searchIngredients(search, userId) {
		if (search === undefined || search === null) search = "";
		const normalizedFilter = removeAccents(search.toLowerCase());


		const pantry = await Pantry.getPantryFromUser(userId);

		const ingredients = await Promise.all(pantry.map( async ({ id_ingrediente: id, cantidad }) => {
			const ingredient = await Ingredient.getIngredient(id);
			return { ...ingredient, cantidad };
		}));

		const res = ingredients.filter(item => {
			const text = removeAccents(item.nombre.toLowerCase());
			return text.startsWith(normalizedFilter);
		});

		return res;
	}
};

module.exports = PantryService;
