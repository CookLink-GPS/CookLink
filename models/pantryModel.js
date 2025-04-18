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
				pantryQueries.updateIngredientQuantity,
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
				pantryQueries.getPantryItemById,
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
	// eslint-disable-next-line no-warning-comments
	async getIngredientsDetails(userId) { // CHECK ESTA FUNC ES LA DE LA NUEVA QUERY
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
				pantryQueries.getPantryItemByIngredient,
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
				pantryQueries.addingredient,
				[ userId, ingredientId, quantity ]
			);
		}
		catch (error) {
			throw new Error(`Error adding ingredient ${ingredientId} to user ${userId}'s pantry`);
		}
	},
	/**
	 * Verifica si un ingrediente ya está en la despensa
	 *
	 * @param {number} userId - ID del usuario
	 * @param {number} ingredientId - ID del ingrediente
	 * @returns {Promise<boolean>} - true si existe, false si no
	 */
	async findItem(userId, ingredientId) {
		try {
			console.log(`[Model] Recibido:`, userId, ingredientId);
			const rows = await db.query(
				`SELECT id_ingrediente, cantidad FROM despensa WHERE id_usuario = ? AND id_ingrediente = ? LIMIT 1`,
				[ userId, ingredientId ]
			);
			return rows.length > 0 ? rows[0] : null;
		}
		catch (error) {
			console.error("[Model pantry] Error al buscar en la despensa:", error);
			return false;
		}
	},
	/**
		 * Resta cantidad de un ingrediente de la despensa del usuario
		 *
		 * @param {Number} userId - ID del usuario
		 * @param {Number} ingredientId - ID del ingrediente
		 * @param {Number} cantidad - Cantidad a restar
		 * @returns {Promise<void>}
		 */
	async decreaseQuantity(userId, ingredientId, cantidad) {
		try {
			await db.query(
				"UPDATE despensa SET cantidad = cantidad - ? WHERE id_usuario = ? AND id_ingrediente = ?",
				[ cantidad, userId, ingredientId ]
			);
		}
		catch (error) {
			throw new Error(`Error al restar ${cantidad} del ingrediente ${ingredientId} para el usuario ${userId}`);
		}
	}

};

module.exports = Pantry;

