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
	const insertPromises = ingredients.map(ingredient =>
		db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES (?, ?)", ingredient));
	await Promise.all(insertPromises); // Ejecuta todas las inserciones en paralelo
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
	const insertPromises = recetas.map(receta =>
		db.query("INSERT INTO recetas (nombre, descripcion) VALUES (?, ?)", receta));
	await Promise.all(insertPromises); // Ejecuta todas las inserciones en paralelo
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
	const insertPromises = contains.map(contain =>
		db.query("INSERT INTO contiene (id_receta, id_ingrediente, unidades) VALUES (?, ?, ?)", contain));
	await Promise.all(insertPromises); // Ejecuta todas las inserciones en paralelo
};

module.exports = { deleteUsers,	deleteIngredients,	insertIngredients,	deletePantry,	insertPantry,	deleteRecipes,	insertRecetas,	deleteContains,	insertContains };
