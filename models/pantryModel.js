const db = require("../config/database");
const { pantryQueries } = require("../config/querys");

/**
 *
 * @typedef PantryIngredient
 * @property {Number} id_ingrediente
 * @property {Number} cantidad
 *
 */
const Pantry = {
	/**
     * Retrieves the pantry of a user.
     *
     * @async
     * @param {Number} userId - User ID.
     * @returns {Promise<PantryIngredient[]>} - Array containing the id, amount, and expiration date
     *                                           of each ingredient in the pantry.
     */

	async getPantryFromUser(userId) {
		try {
			const result = await db.query(pantryQueries.getPantryFromUser, [ userId ]);
			return result.map(row => ({ ...row }));
		}
		catch (error) {
			console.error("Error fetching pantry:", error);

			throw new Error(`Error fetching pantry for user ${userId}`);
		}
	},

  	/**
     * Deletes an ingredient from a user's pantry.
     *
     * @async
     * @param {Number} userId - User ID.
     * @param {Number} ingredientId - Ingredient ID to delete.
     * @returns {Promise<void>}
     * @throws {Error} - If an error occurs while deleting the ingredient.
     */
	async deleteIngredient(userId, ingredientId) {
		try {
			await db.query(pantryQueries.deleteIngredient, [ userId, ingredientId ]);
		}
		catch (error) {
			console.error("Error deleting ingredient:", error);
			throw new Error(`Error deleting ingredient ${ingredientId} from user ${userId}'s pantry`);
		}
	},

	async updateIngredientQuantity(id_despensa, newQuantity) {
		try {
			await db.query(
				"UPDATE despensa SET cantidad = ? WHERE id_despensa = ?",
				[ newQuantity, id_despensa ]
			);
		}
		catch (error) {
			console.error("Error updating quantity:", error);
			throw new Error(`Error updating quantity for pantry item ${id_despensa}`);
		}
	},

	async getPantryItemById(id_despensa) {
		try {
			const [ result ] = await db.query(
				"SELECT * FROM despensa WHERE id_despensa = ?",
				[ id_despensa ]
			);
			return result;
		}
		catch (error) {
			console.error("Error getting pantry item:", error);
			throw new Error(`Error getting pantry item ${id_despensa}`);
		}
	},
	/**
     * Retrieves all ingredients with their name and unit type
     * from a user's pantry.
     *
     * @async
     * @param {Number} userId - User ID.
     * @returns {Promise<PantryIngredient[]>} - Array containing the id, amount, expiration date,
	 *                                          name and unit type of each ingredient in the pantry.
     */
	async getIngredientsDetails(userId) {
		try {
			const result = await db.query(pantryQueries.getIngredientsDetails, [ userId ]);
			return result.map(row => ({ ...row }));
		}
		catch (error) {
			console.log("Error");
			throw new Error(`Error fetching pantry for user ${userId}`);
		}
	}


};

module.exports = Pantry;
