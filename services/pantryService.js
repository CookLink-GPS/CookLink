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
	async deleteIngredient(userId, ingredientId, quantityToDelete) {
		if (!userId || !ingredientId || !quantityToDelete) throw new AppError("Missing required data", badRequest);


		try {
			// Primero verifica la cantidad actual
			const pantry = await Pantry.getPantryFromUser(userId);
			const ingredient = pantry.find(i => i.id_ingrediente == ingredientId);

			if (!ingredient) throw new AppError("Ingredient not found in pantry", badRequest);


			if (quantityToDelete > ingredient.cantidad) throw new AppError("Cannot delete more than available quantity", badRequest);


			// Si la cantidad a eliminar es igual a la cantidad disponible, elimina el registro
			if (quantityToDelete === ingredient.cantidad) await Pantry.deleteIngredient(userId, ingredientId);
			 else
				// Si no, actualiza la cantidad
				await Pantry.updateIngredientQuantity(userId, ingredientId, ingredient.cantidad - quantityToDelete);

		}
		catch (error) {
			console.error(error);
			throw new AppError("Error deleting ingredient", internalServerError);
		}
	}
};

module.exports = PantryService;
