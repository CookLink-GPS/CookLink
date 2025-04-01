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
	// TODO ESTA Y LA SIGUIENTE FUNCS SON IGUALES!!!! REVISAAAARRRR
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
	// TODO CON ESTAS DOS PASA LO MISMO!!!!
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
