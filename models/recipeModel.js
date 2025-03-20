const db = require("../config/database");
const { recipeQueries } = require("../config/querys");

/**
 *
 * @typedef Recipe
 * @property {Number} id
 * @property {String} nombre
 * @property {String} descripcion
 *
 */
const Recipe = {
	/**
     * Returns  all recipes from the database
     * @async
     * @returns {Promise<Recipe[]>}
     */
	async getAllRecipes() {
		try {
			const result = await db.query(recipeQueries.getAllRecipes);

			return result.map(row => ({ ...row }));
		}
		catch (error) {
			console.log(error);
			throw new Error("Error al obtener todas las recetas");
		}
	},
	async getRecipeById(id) {
		try {
			const recipe = await db.query("SELECT * FROM recetas WHERE id = ?", [ id ]);
			return recipe[0];
		}
		catch (error) {
			console.error("An error occurred while getting the recipe by id: ", error);
			throw new Error("An error occurred while getting the recipe by id: ", error);
		}
	}
};

module.exports = Recipe;
