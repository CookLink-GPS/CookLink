const db = require("../config/database");
const { pantryQueries } = require("../config/queries");

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
     * @returns {Promise<PantryIngredient[]>} - Array containing the id and amount
     *                                           of each ingredient in the pantry.
     */

	async getPantryFromUser(userId) {
		try {
			const result = await db.query(pantryQueries.getPantryFromUser, [ userId ]);
			return result.map(row => ({ ...row }));
		}
		catch (error) {
			throw new Error(`Error fetching pantry for user ${userId}`);
		}
	},

	/**
     * Retrieves all ingredients with their name and unit type
     * from a user's pantry.
     *
     * @async
     * @param {Number} userId - User ID.
     * @returns {Promise<PantryIngredient[]>} - Array containing the id and amount
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
     * Updates the quantity of an ingredient in the pantry.
     *
     * @async
     * @param {Number} idDespensa - Pantry item ID.
     * @param {Number} newQuantity - New quantity to set.
     * @returns {Promise<void>}
     * @throws {Error} - If an error occurs while updating the quantity.
     */
	async updateIngredientQuantity(idDespensa, newQuantity) {
		try {
			await db.query(
				"UPDATE despensa SET cantidad = ? WHERE id_despensa = ?",
				[ newQuantity, idDespensa ]
			);
		}
		catch (error) {
			throw new Error(`Error updating quantity for pantry item ${idDespensa}`);
		}
	},

	/**
     * Retrieves a pantry item by its ID.
     *
     * @async
     * @param {Number} idDespensa - Pantry item ID.
     * @returns {Promise<Object>} - Pantry item details.
     * @throws {Error} - If an error occurs while retrieving the item.
     */
	async getPantryItemById(idDespensa) {
		try {
			const [ result ] = await db.query(
				"SELECT * FROM despensa WHERE id_despensa = ?",
				[ idDespensa ]
			);
			return result;
		}
		catch (error) {
			throw new Error(`Error getting pantry item ${idDespensa}`);
		}
	},

	/**
     * Retrieves all ingredients with their name and unit type
     * from a user's pantry.
     *
     * @async
     * @param {Number} userId - User ID.
     * @returns {Promise<PantryIngredient[]>} - Array containing the id and amount
	 *                                          name and unit type of each ingredient in the pantry.
     */
	async getIngredientsDetails(userId) {
		try {
			const result = await db.query(pantryQueries.getIngredientsDetails, [ userId ]);
			return result.map(row => ({ ...row }));
		}
		catch (error) {
			throw new Error(`Error fetching pantry for user ${userId}`);
		}
	}


};

module.exports = Pantry;
