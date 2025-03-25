const db = require("../config/database");
const { pantryQueries } = require("../config/querys");

/**
 *
 * @typedef PantryIngredient
 * @property {Number} id_ingrediente
 * @property {Number} cantidad
 * @property {String} caducidad
 *
 */
const Pantry = {
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
	}
};

module.exports = Pantry;
