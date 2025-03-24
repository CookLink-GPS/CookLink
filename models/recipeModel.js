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
	/**
	 * Returns a recipe by its id
	 * @async
	 * @param {Number} id
	 * @returns {Promise<Recipe>}
	 */
	async getRecipeById(id) {
		try {
			const recipe = await db.query(recipeQueries.getRecipeById, [ id ]);
			return recipe[0];
		}
		catch (error) {
			console.error(error);
			throw new Error("Error al obtener el id ", error);
		}
	},
	/**
	 * Returns the ingredients of a recipe by its id
	 * @async
	 * @param {Number} id
	 * @returns {Promise<Ingredient[]>
	 */
	async getIngredients(id) {
		try {
			const ingredients = await db.query(recipeQueries.getIngredients, [ id ]);
			return ingredients;
		}
		catch (error) {
			console.error(error);
			throw new Error("Error al conseguir los ingredientes de esa receta", error);
		}
	}
};

module.exports = Recipe;
