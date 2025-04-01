/* eslint-disable no-magic-numbers */
const Pantry = require("../models/pantryModel");
const { badRequest, internalServerError } = require("../config/httpcodes");
const AppError = require("../utils/AppError");

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

		const ERROR = 403;
		try {
			const pantryItem = await Pantry.getPantryItemById(idDespensa);

			if (!pantryItem) throw new AppError("Item not found in pantry", badRequest);

			if (pantryItem.id_usuario !== userId) throw new AppError("Unauthorized operation", ERROR);

			if (quantityToDelete > pantryItem.cantidad) throw new AppError("Cannot delete more than available quantity", badRequest);

			if (quantityToDelete === pantryItem.cantidad) await Pantry.deleteIngredient(userId, pantryItem.id_ingrediente);
			 else await Pantry.updateIngredientQuantity(idDespensa, pantryItem.cantidad - quantityToDelete);
		}
		catch (error) {
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
	}
};

module.exports = PantryService;
