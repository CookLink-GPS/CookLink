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
	/**
     * Returns the pantry of a user
     *
     * @async
     * @param {Number} userId
     * @returns {Promise<PantryIngredient[]>} -- An array containing the id, amount and expiration date
     *                                           of each ingredient in the pantry
     */
	async getPantryFromUser(userId) {
		try {
			const result = await db.query(pantryQueries.getPantryFromUser, [ userId ]);

			return result.map(row => ({ ...row }));
		}
		catch (error) {
			console.log("Error");
			throw new Error(`Error obteniendo la despensa del usuario ${userId}`);
		}
	}
};

module.exports = Pantry;
