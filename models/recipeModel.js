const db = require("../config/database");
const { recipeQueries } = require("../config/queries");

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
	}
};

module.exports = Recipe;
