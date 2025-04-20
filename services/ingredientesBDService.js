const Ingredient = require("../models/ingredientModel");
const PantryModel = require("../models/pantryModel");

const ingredientesBDService = {
	getAllIngredientsFromDatabase: async () => {
		const ingredients = await Ingredient.getAllIngredients();

		return ingredients;
	},

	addIngredientIntoPantry: async (userId, ingredientId, cantidad) => {
		try {
			await PantryModel.addIngredient(userId, ingredientId, cantidad);
		}
		catch (error) {
			console.error("Error al añadir ingrediente en la despensa:", error);
			throw error;
		}
	},
	getIngredientsFromUserPantry: async userId => {
		try {
			const userIngredients = await PantryModel.getPantryFromUser(userId);
			return userIngredients;
		}
		catch (error) {
			console.error("Error usuario:", error);
			throw error;
		}
	}
};

module.exports = ingredientesBDService;
