const db = require("../config/database");

const ShoppingList = {
	async addItem(userId, ingredientId, cantidad, unidad) {
		try {
			await db.query(`
				INSERT INTO lista_compra (id_usuario, id_ingrediente, cantidad, unidad_medida)
				VALUES (?, ?, ?, ?)
				ON DUPLICATE KEY UPDATE cantidad = VALUES(cantidad)
			`, [ userId, ingredientId, cantidad, unidad ]);
		}
		catch (error) {
			throw new Error(`Error al añadir a la lista de la compra: ${ error.message}`);
		}
	}
};

module.exports = ShoppingList;
