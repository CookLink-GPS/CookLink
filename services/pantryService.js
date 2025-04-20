const Pantry = require("../models/pantryModel");
const Ingredient = require("../models/ingredientModel");
const { badRequest, internalServerError, forbidden } = require("../config/httpcodes");
const AppError = require("../utils/AppError");
const { removeAccents } = require("../utils/stringFunctions");


/**
 *
 * @typedef IngredientQuantity
 * @property {Number} Id
 * @property {Number} idDespensa
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
			ingredients.sort((a, b) => a.nombre.localeCompare(b.nombre));
			return ingredients;
		}
		catch (error) {
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
	async deleteIngredient(userId, idDespensa, quantityToDelete) {
		if (!userId || !idDespensa || !quantityToDelete) throw new AppError("Missing required data", badRequest);

		try {
			const pantryItem = await Pantry.getPantryItemById(idDespensa);

			if (!pantryItem) throw new AppError("Item not found in pantry", badRequest);
			if (pantryItem.id_usuario !== userId) throw new AppError("Unauthorized operation", forbidden);
			if (quantityToDelete > pantryItem.cantidad) throw new AppError("Cannot delete more than available quantity", badRequest);
			const ingredientId = pantryItem.id_ingrediente;
			if (quantityToDelete === pantryItem.cantidad) await Pantry.deleteIngredient(userId, pantryItem.id_ingrediente);
			else await Pantry.updateIngredientQuantity(userId, ingredientId, pantryItem.cantidad - quantityToDelete);

		}
		catch (error) {
			console.error(error.message);
			throw new AppError("Error deleting ingredient", internalServerError);
		}
	},

	/**
     * Adds or updates an ingredient in the user's pantry.
     *
     * @async
     * @function addIngredient
     * @memberof PantryService
     * @param {Number} userId - User ID.
     * @param {Number} ingredientId - Ingredient ID to add/update.
     * @param {Number} quantity - Quantity to add.
     * @returns {Promise<void>}
     * @throws {AppError} If validation fails or database error occurs.
     */
	async addIngredient(userId, ingredientId, quantity) {
		if (!userId || !ingredientId || quantity === undefined) throw new AppError("Missing required data", badRequest);

		if (quantity <= 0) throw new AppError("Quantity must be positive", badRequest);

		try {
			const existingItem = await Pantry.getPantryItemByIngredient(userId, ingredientId);

			if (existingItem) await Pantry.updateIngredientQuantity(
				existingItem.id_despensa,
				existingItem.cantidad + quantity
			);
			else await Pantry.addIngredient(userId, ingredientId, quantity);
		}
		catch (error) {
			throw new AppError("Error adding ingredient to pantry", internalServerError);
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
		if (!userId) throw new AppError("User ID is required", badRequest);
		if (search === undefined || search === null) search = "";
		const normalizedFilter = removeAccents(search.toLowerCase());


		const pantry = await Pantry.getPantryFromUser(userId);
		pantry.sort((a, b) => a.nombre_ingrediente.localeCompare(b.nombre_ingrediente));


		const ingredients = await Promise.all(pantry.map( async ({ id_ingrediente: id, cantidad, id_despensa: idDespensa }) => {
			const ingredient = await Ingredient.getIngredient(id);
			return { ...ingredient, cantidad, idDespensa };
		}));

		const res = ingredients.filter(item => {
			const text = removeAccents(item.nombre.toLowerCase());
			return text.startsWith(normalizedFilter);
		});

		return res;
	}
};

module.exports = PantryService;
