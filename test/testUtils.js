const { saltRounds } = require("../config/config");
const db = require("../config/database");
const bcrypt = require("bcrypt");

/**
 * Elimina todos los usuarios de la base de datos.
 *
 * @returns {Promise<void>} - No devuelve ningún valor.
 */
const deleteUsers = async () => {
	await db.query("DELETE FROM lista_compra");
	await db.query("DELETE FROM despensa");
	await db.query("DELETE FROM contiene");
	await db.query("DELETE FROM usuarios");
};

const createuser = async () => {
	await db.query("INSERT INTO usuarios (id, username, password) VALUES (1, 'dummy', '12345678Aa:')");
};

/**
 * Elimina todos los ingredientes de la base de datos.
 *
 * @returns {Promise<void>}
 */
const deleteIngredients = async () => {
	await db.query("DELETE FROM contiene");
	await db.query("DELETE FROM despensa");
	await db.query("DELETE FROM ingredientes");
};

/**
 * Inserta varios ingredientes
 *
 * @typedef Ingredient
 * @property {String} nombre
 * @property {String} tipoUnidad
 *
 * @async
 * @param {Ingredient[]} ingredients
 * @returns {void}
 */
const insertIngredients = async ingredients => {

	for (const ingredient of ingredients) await db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES (?, ?)", ingredient);

	return db.query("SELECT id, nombre, tipoUnidad FROM ingredientes");
};

/**
 * Elimina todos los registros de la despensa (tabla contiene y despensa)
 *
 * @returns {Promise<void>}
 */
const deletePantry = async () => {
	await db.query("DELETE FROM contiene");
	await db.query("DELETE FROM despensa");
};

/**
 * Inserta varios registros en la despensa
 *
 * @param {Array} pantrys - Arreglo con los datos de la despensa
 * @returns {Promise<void>}
 */
const insertPantry = async pantrys => {
	const insertPromises = pantrys.map(pantry =>
		db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?)", pantry));
	await Promise.all(insertPromises); // Ejecuta todas las inserciones en paralelo
};

const insertPantryAddIngredient = async pantrys => {
	const insertPromises = pantrys.map(pantry =>
		db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?)", pantry));
	await Promise.all(insertPromises); // Ejecuta todas las inserciones en paralelo
	return db.query("SELECT id_usuario, id_ingrediente, cantidad FROM despensa");
};

/**
 * Elimina todas las recetas de la base de datos.
 *
 * @returns {Promise<void>}
 */
const deleteRecipes = async () => {
	await db.query("DELETE FROM recetas");
};

/**
 * Inserta varias recetas
 *
 * @param {Array} recetas - Arreglo con los datos de las recetas
 * @returns {Promise<Array>} - Devuelve una consulta con los id y nombre de las recetas
 */
const insertRecetas = async recetas => {
	for (const receta of recetas) await db.query("INSERT INTO recetas (nombre, descripcion) VALUES (?, ?)", receta);


	return db.query("SELECT id, nombre FROM recetas");
};

/**
 * Elimina todos los registros de la tabla contiene.
 *
 * @returns {Promise<void>}
 */
const deleteContains = async () => {
	await db.query("DELETE FROM contiene");
};

/**
 * Inserta varios registros en la tabla contiene (relacion entre recetas e ingredientes)
 *
 * @param {Array} contains - Arreglo con los datos de las relaciones
 * @returns {Promise<void>}
 */
const insertContains = async contains => {
	const insertPromises = contains.map(contain => db.query("INSERT INTO contiene (id_receta, id_ingrediente, unidades) VALUES (?, ?, ?)", contain));
	await Promise.all(insertPromises); // Ejecuta todas las inserciones en paralelo
};

const insertListaCompra = async ingredientes => {
	const insertPromises = ingredientes.map( ingrediente =>
		db.query("INSERT INTO lista_compra (id_usuario, id_ingrediente, cantidad, unidad_medida) VALUES (?, ?, ?, ?)", ingrediente));
	await Promise.all(insertPromises); // Ejecuta todas las inserciones en paralelo
};

const deleteListaCompra = async () => {
	await db.query("DELETE FROM lista_compra");
};

const insertDummy = async () => {
	await db.query(`INSERT INTO usuarios VALUES (1, "dummy", "dummy")`);
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
	await db.query("DELETE FROM lista_compra");
	await db.query("DELETE FROM despensa");
	await db.query("DELETE FROM contiene");
	await db.query("DELETE FROM usuarios");
	const password = await bcrypt.hash("12345678", saltRounds);

	await db.query("INSERT INTO usuarios (id, username, password) VALUES (?, ?, ?)", [
		1,
		"user1",
		password
	]);
	await db.query("INSERT INTO usuarios (id, username, password) VALUES (?, ?, ?)", [
		2,
		"user2",
		password
	]);
};

const deleteShoppingList = async () => {
	await db.query("DELETE FROM lista_compra");
};

const insertShoppigList = async lista => {
	const insertPromises = lista.map(list =>
		db.query("INSERT INTO lista_compra (id_usuario, id_ingrediente, cantidad, unidad_medida) VALUES (?, ?, ?, ?)", list));
	await Promise.all(insertPromises); // Ejecuta todas las inserciones en paralelo
};

const getPantryQuantity = async (idUsuario, idIngrediente) => {
	const [ result ] = await db.query(
		`SELECT cantidad FROM despensa WHERE id_usuario = ? AND id_ingrediente = ?`,
		[ idUsuario, idIngrediente ]
	);
	return result?.cantidad ?? 0; // Devuelve 0 si no hay resultado
};

module.exports = {
	deleteUsers,
	deleteIngredients,
	insertIngredients,
	deletePantry,
	insertPantry,
	deleteRecipes,
	insertRecetas,
	deleteContains,
	insertContains,
	insertListaCompra,
	deleteListaCompra,
	insertDummy,
	createuser,
	createTestUsers,
	testtingSession,
	deleteShoppingList,
	insertShoppigList,
	getPantryQuantity,
	insertPantryAddIngredient
};
