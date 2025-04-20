const db = require("../config/database");
const { shoppingListQueries } = require("../config/queries");

const ShoppingList = {
	/**
	 * Busca un ítem en la lista de compra por usuario e ingrediente.
	 * @param {Number} userId
	 * @param {Number} ingredientId
	 * @returns {Promise<Object|null>} { id_lista_compra, cantidad } o null
	 */
	async getItem(userId, ingredientId) {
		try {
			const [ row ] = await db.query(shoppingListQueries.findItem, [ userId, ingredientId ]);
			return row || null;
		}
		catch (error) {
			throw new Error(`Error al buscar el ítem en la lista: ${error.message}`);
		}
	},

	/**
	 * Inserta un nuevo ítem en la lista de compra.
	 * @param {Number} userId
	 * @param {Number} ingredientId
	 * @param {Number} quantity
	 * @param {String} unit
	 */
	async addItem(userId, ingredientId, quantity, unit) {
		try {
			await db.query(shoppingListQueries.addItem, [ userId, ingredientId, quantity, unit ]);
		}
		catch (error) {
			throw new Error(`Error al añadir a la lista de la compra: ${error.message}`);
		}
	},

	/**
	 * Actualiza la cantidad de un ítem existente.
	 * @param {Number} listId
	 * @param {Number} newQuantity
	 */
	async updateQuantity(listId, newQuantity) {
		try {
			await db.query(shoppingListQueries.updateQuantity, [ newQuantity, listId ]);
		}
		catch (error) {
			throw new Error(`Error al actualizar la cantidad del ítem: ${error.message}`);
		}
	}
};

module.exports = ShoppingList;
