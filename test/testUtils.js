const db = require("../config/database");

/**
 * Elimina todos los usuarios de la base de datos.
 *
 * @returns {Promise<void>} - No devuelve ningún valor.
 */
const deleteUsers = async () => {
	await db.query("DELETE FROM usuarios");
};

const createuser = async () => {
	await db.query("INSERT INTO usuarios (username, password) VALUES ('Luis', '12345678Aa:')");
};

/**
 * Elimina todos los registros de la tabla de ingredientes.
 */
async function deleteIngredients () {
	try {
		await db.query("DELETE FROM ingredientes");
	}
	catch (error) {
		console.error("Error al borrar ingredientes:", error);
	}
}

/**
   * Elimina todos los registros de la tabla de despensa.
   */
async function deletePantryItems () {
	try {
		await db.query("DELETE FROM despensa");
	}
	catch (error) {
		console.error("Error al borrar elementos de despensa:", error);
	}
}
module.exports = { deleteUsers, createuser, deletePantryItems, deleteIngredients };
