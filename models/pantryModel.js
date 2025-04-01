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
     * @returns {Promise<PantryIngredient[]>} - Array containing the id, amount, and expiration date
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
			throw new Error(`Error deleting ingredient ${ingredientId} from user ${userId}'s pantry`);
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
     * @returns {Promise<PantryIngredient[]>} - Array containing the id, amount, expiration date,
	 *                                          name and unit type of each ingredient in the pantry.
     */
	async getIngredientsDetails(userId) {
		try {
			const result = await db.query(pantryQueries.getIngredientsDetails, [ userId ]);
			return result.map(row => ({
				idDespensa: row.id_despensa,
				idIngrediente: row.id_ingrediente,
				nombre: row.nombre_ingrediente,
				cantidad: row.cantidad,
				tipoUnidad: row.tipoUnidad
			}));
		}
		catch (error) {
			throw new Error(`Error fetching pantry for user ${userId}`);
		}
	},

	/**
     * Finds a pantry item by user and ingredient IDs
     * @async
     * @function getPantryItemByIngredient
     * @memberof PantryModel
     * @param {Number} userId - ID of the user
     * @param {Number} ingredientId - ID of the ingredient
     * @returns {Promise<Object|null>} Pantry item or null if not found
     * @throws {Error} When database query fails
     */
	async getPantryItemByIngredient(userId, ingredientId) {
		try {
			const [ result ] = await db.query(
				"SELECT * FROM despensa WHERE id_usuario = ? AND id_ingrediente = ?",
				[ userId, ingredientId ]
			);
			return result;
		}
		catch (error) {
			throw new Error(`Error getting pantry item for user ${userId} and ingredient ${ingredientId}`);
		}
	},

	/**
     * Adds a new ingredient to user's pantry
     * @async
     * @function addIngredient
     * @memberof PantryModel
     * @param {Number} userId - ID of the user
     * @param {Number} ingredientId - ID of the ingredient to add
     * @param {Number} quantity - Initial quantity
     * @returns {Promise<void>}
     * @throws {Error} When database query fails
     */
	async addIngredient(userId, ingredientId, quantity) {
		try {
			await db.query(
				"INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?)",
				[ userId, ingredientId, quantity ]
			);
		}
		catch (error) {
			throw new Error(`Error adding ingredient ${ingredientId} to user ${userId}'s pantry`);
		}
	}
};

module.exports = Pantry;
