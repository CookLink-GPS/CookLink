/* eslint-disable no-magic-numbers */
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
	 * Adds or updates an ingredient in the pantry.
	 *
	 * @param {Number} idDespensa - Pantry item ID.
	 * @returns {Promise<void>} - Result of the operation.
	 * @throws {Error} - If an error occurs while getting the pantry item.
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
			return result.map(row => ({ ...row }));
		}
		catch (error) {
			throw new Error(`Error fetching pantry for user ${userId}`);
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

			console.log(`[Model] Resultado findItem:`, rows[0]);
			return rows.length > 0 ? rows[0] : null;
		}
		catch (error) {
			console.error("[Model pantry] Error al buscar en la despensa:", error);
			return false;
		}
	},

	/**
	 * Añade un nuevo ingrediente a la despensa (sin verificar duplicados).
	 *
	 * @param {number} userId - ID del usuario
	 * @param {number} ingredientId - ID del ingrediente
	 * @param {number} cantidad - Cantidad a añadir
	 * @returns {Promise<Object>} - Resultado de la inserción
	 */
	async addItem(userId, ingredientId, cantidad) {
		try {
			console.log(`[Model pantry] Añadiendo a despensa - Usuario: ${userId}, Ingrediente: ${ingredientId}, Cantidad: ${cantidad}`);

			const result = await db.query(
				`INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?)`,
				[ userId, ingredientId, cantidad ]
			);

			console.log(`[Model pantry] Ingrediente añadido.`);
			return { success: true, message: "Ingrediente añadido a la despensa.", result };

		}
		catch (error) {
			console.error("[Model pantry] Error al añadir a la despensa:", error);
			return { success: false, message: "Error al añadir a la despensa.", error };
		}
	},

	/**
	 * Actualiza la cantidad de un ingrediente en la despensa
	 *
	 * @param {number} userId - ID del usuario
	 * @param {number} ingredientId - ID del ingrediente
	 * @param {number} cantidad - Cantidad a sumar
	 * @returns {Promise<Object>} - Resultado de la actualización
	 */
	async updateItem(userId, ingredientId, cantidad) {
		try {
			await db.query(
				`UPDATE despensa SET cantidad = cantidad + ? WHERE id_usuario = ? AND id_ingrediente = ?`,
				[ cantidad, userId, ingredientId ]
			);
			console.log(`[Model pantry] Cantidad actualizada.`);
			return { success: true, message: "Cantidad actualizada en la despensa." };
		}
		catch (error) {
			console.error("[Model pantry] Error al actualizar la despensa:", error);
			return { success: false, message: "Error al actualizar la cantidad.", error };
		}
	}

};

module.exports = Pantry;
