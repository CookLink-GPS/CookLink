const db = require("../config/database");
const { pantryQueries } = require("../config/queries");

/**
 *
 * @typedef PantryIngredient
 * @property {Number} id_ingrediente
 * @property {Number} cantidad
 * @property {String} caducidad
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
			console.log("Error");
			throw new Error(`Error fetching pantry for user ${userId}`);
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
			console.log("Error");
			throw new Error(`Error deleting ingredient ${ingredientId} from user ${userId}'s pantry`);
		}
	},

	/**
     * Add an ingredient into user's pantry.
     *
     * @async
     * @param {Number} userId - User ID.
     * @param {Number} ingredientId - Ingredient ID to add.
     * @param {Number} cantidad - Cantidad ID to add.
     * @returns {Promise<void>}
     * @throws {Error} - If an error occurs while adding the ingredient.
     */
	async addIngrediente(userId, ingredientId, cantidad) {
		try {
			const exists = await db.query(
				"SELECT * FROM despensa WHERE id_usuario = ? AND id_ingrediente = ?",
				[ userId, ingredientId ]
			);

			if (exists.length > 0) await db.query(
				"UPDATE despensa SET cantidad = cantidad + ? WHERE id_usuario = ? AND id_ingrediente = ?",
				[ cantidad, userId, ingredientId ]
			);
			 else await db.query(
				pantryQueries.addIngrediente,
				[ userId, ingredientId, cantidad ]
			);

		}
		catch (error) {
			throw new Error(`Error adding ingredient ${ingredientId}, cantidad ${cantidad} into user ${userId}'s pantry`);
		}
	},

	/**
     * Get an user pantry with name ingredient.
     *
     * @async
     * @param {Number} userId - User ID.
     * @returns {Promise<PantryIngredient[]>}
     * @throws {Error} - If an error occurs while fetching pantry for userId.
     */
	async getPantryFromUserWithNameIngredient(userId) {
		try {
			const result = await db.query(pantryQueries.getPantryFromUserWithNameIngredient, [ userId ]);
			return result.map(row => ({ ...row }));
		}
		catch (error) {
			throw new Error(`Error fetching pantry for user ${userId}`);
		}
	}
};

module.exports = Pantry;
