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

const deletePantry = async () => {
	await db.query("DELETE FROM contiene");
	await db.query("DELETE FROM despensa");
};

const insertPantry = async pantrys => {
	const queries = [];
	for (const pantry of pantrys) queries.push(db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?)", pantry));

	await Promise.all(queries);
};

const deleteRecipes = async () => {
	await db.query("DELETE FROM recetas");
};

const insertRecetas = async recetas => {
	for (const receta of recetas) await db.query("INSERT INTO recetas (nombre, descripcion) VALUES (?, ?)", receta);
	return db.query("SELECT id, nombre FROM recetas");
};

const deleteContains = async () => {
	await db.query("DELETE FROM contiene");
};

const insertContains = async contains => {
	for (const contain of contains) await db.query("INSERT INTO contiene (id_receta, id_ingrediente, unidades) VALUES (?, ?, ?)", contain);
};

const insertDummy = async () => {
	await db.query(`INSERT INTO usuarios VALUES (1, "dummy", "dummy")`);
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
	insertDummy
};
