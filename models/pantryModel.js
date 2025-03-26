const db = require("../config/database");
// Const { pantryQueries } = require("../config/querys");

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
 * Verifica si un ingrediente ya está en la despensa
 * @param {number} userId - ID del usuario
 * @param {number} ingredientId - ID del ingrediente
 * @returns {Promise<boolean>} - true si existe, false si no
 */
	findItem: async (userId, ingredientId) => {
		try {
			const rows = await db.query(
				`SELECT id_ingrediente, cantidad FROM despensa WHERE id_usuario = ? AND id_ingrediente = ? LIMIT 1`,
				[ userId, ingredientId ]
			);

			console.log(`[Model] Resultado findItem:`, rows[0]);
			const cero = 0;
			return rows.length > cero ? rows[0] : null;
		}
		catch (error) {
			console.error("[Model pantry] Error al buscar en la despensa:", error);
			return false;
		}
	},

	/**
 * Añade un nuevo ingrediente a la despensa (sin verificar duplicados).
 * @param {number} userId - ID del usuario
 * @param {number} ingredientId - ID del ingrediente
 * @param {number} cantidad - Cantidad a añadir
 * @returns {Promise<Object>} - Resultado de la inserción
 */
	addItem: async (userId, ingredientId, cantidad) => {
		try {
			console.log(`[Model pantry] Añadiendo a despensa - Usuario: ${userId}, Ingrediente: ${ingredientId}, Cantidad: ${cantidad}`);

			// Insertar directamente en la tabla "despensa"
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
 * @param {number} userId - ID del usuario
 * @param {number} ingredientId - ID del ingrediente
 * @param {number} cantidad - Cantidad a sumar
 * @returns {Promise<Object>} - Resultado de la actualización
 */
	updateItem: async (userId, ingredientId, cantidad) => {
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
