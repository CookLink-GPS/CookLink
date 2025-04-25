const db = require("../config/database");
const { containsQueries } = require("../config/queries");

/**
 *
 * @typedef RecipeIngredient
 * @property {Number} id
 * @property {String} nombre
 * @property {Number} unidades
 * @property {Number} tipoUnidad
 */
const Contains = {
	/**
     * Returns all ingredients from a recipe
     *
     * @async
     * @param {Number} recipeId
     * @returns {Promise<RecipeIngredient[]>}
     */
	async getIngredientsFromRecipe(recipeId) {
		try {
			const result = await db.query(containsQueries.getFromRecipe, [ recipeId ]);

			return result.map(row => ({ ...row }));
		}
		catch (error) {
			throw new Error(`Error obteniendo los ingredientes de la receta ${recipeId}`);
		}
	}
};

module.exports = Contains;
