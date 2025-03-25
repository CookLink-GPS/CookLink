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
	}
};

module.exports = PantryService;
