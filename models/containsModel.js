const db = require("../config/database");
const { containsQueries } = require("../config/querys");

/**
 *
 * @typedef RecipeIngredient
 * @property {Number} id_ingrediente
 * @property {Number} unidades
 *
 */
const Contains = {
	/**
     * Returns all ingredients from a recipe
     *
     * @async
     * @param {Number} recipeId
     * @returns {Promise<RecipeIngredient[]>}
     */
	async getFromRecipe(recipeId) {
		try {
			const result = await db.query(containsQueries.getFromRecipe, [ recipeId ]);

			return result.map(row => ({ ...row }));
		}
		catch (error) {
			console.log(error);
			throw new Error(`Error obteniendo los ingredientes de la receta ${recipeId}`);
		}
	}
};

module.exports = Contains;
