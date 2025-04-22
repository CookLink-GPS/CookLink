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
		const [ row ] = await db.query(shoppingListQueries.findItem, [ userId, ingredientId ]);
		return row || null;
	},

	/**
   * Inserta un nuevo ítem en la lista de compra.
   * @param {Number} userId
   * @param {Number} ingredientId
   * @param {Number} quantity
   * @param {String} unit
   */
	async addItem(userId, ingredientId, quantity, unit) {
		await db.query(shoppingListQueries.addItem, [ userId, ingredientId, quantity, unit ]);
	},

	/**
   * Actualiza la cantidad de un ítem existente.
   * @param {Number} listId
   * @param {Number} newQuantity
   */
	async updateQuantity(listId, newQuantity) {
		await db.query(shoppingListQueries.updateQuantity, [ newQuantity, listId ]);
	},


	/**
   * Obtiene todos los ítems de la lista de compra de un usuario
   * en orden alfabético por nombre de ingrediente.
   * @param {Number} userId
   * @returns {Promise<Array<{idListaCompra, nombre, cantidad, unidad}>>}
   */
	async getItems(userId) {
		const rows = await db.query(shoppingListQueries.getList, [ userId ]);
		return rows.map(r => ({
			idListaCompra: r.id_lista_compra,
			nombre: r.nombre,
			cantidad: r.cantidad,
			unidad: r.unidad_medida
		}));
	}
};

module.exports = ShoppingList;
