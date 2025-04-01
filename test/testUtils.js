const { saltRounds } = require("../config/config");
const db = require("../config/database");
const bcrypt = require("bcrypt");

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

const testtingSession = async () => {
	await db.query("DELETE FROM usuarios");
	const password = await bcrypt.hash("12345678", saltRounds);

	await db.query("INSERT INTO usuarios (username, password) VALUES (?, ?)", [
		"user1",
		password
	]);
	await db.query("INSERT INTO usuarios (username, password) VALUES (?, ?)", [
		"user2",
		password
	]);
};

module.exports = { deleteUsers, createTestUsers, testtingSession };
