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
 * Crea usuarios de prueba en la base de datos.
 */
const createTestUsers = async () => {
	await db.query("INSERT INTO usuarios (username, password) VALUES (?, ?)", [
		"user1",
		"12345678"
	]);
	await db.query("INSERT INTO usuarios (username, password) VALUES (?, ?)", [
		"user2",
		"12345678"
	]);
};

module.exports = { deleteUsers, createTestUsers };
