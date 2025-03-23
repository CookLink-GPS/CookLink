const Recipe = require("../models/recipeModel");

const RecipeService = {

	/**
     * Returns all recipes in the application
     *
     * @returns {Promise<Array<Recipe>>} - Array containing all the recipes
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
     * @returns {Promise<Array<Recipe>>} - Recommendations
     */
	async getRecommendations({ id }) {
		const allRecipes = await Recipe.getAllRecipes();
		// TODO get all ingredients from user

		return allRecipes.filter(() => true); // TODO filter from ingredients
	}
};

module.exports = RecipeService;
