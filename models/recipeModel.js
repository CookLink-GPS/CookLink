const db = require("../config/database");
const { recipeQuerys } = require("../config/querys");

const Recipe = {

	/**
     * Returns  all recipes from the database
     *
     * @async
     * @returns {Promise<Array<Recipe>>}
     */
	async getAllRecipes() {
		try {
			return await db.query(recipeQuerys.getAllRecipes);
		}
		catch (error) {
			console.log(error);
			throw new Error("Error al obtener todas las recetas");
		}
	}
};

module.exports = Recipe;
