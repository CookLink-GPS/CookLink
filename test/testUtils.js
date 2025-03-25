const db = require("../config/database");

/**
 * Elimina todos los usuarios de la base de datos.
 *
 * @returns {Promise<void>} - No devuelve ningún valor.
 */
const deleteUsers = async () => {
	await db.query("DELETE FROM usuarios");
};

/**
 * Elimina todos los ingredientes de la base de datos.
 *
 * @returns {Promise<void>}
 */
const deleteIngredients = async () => {
	await db.query("DELETE FROM ingredientes");
};

module.exports = { deleteUsers, deleteIngredients };
