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
	return await db.query("SELECT id, nombre FROM ingredientes");
};

const deleteRecipe = async () => {
	await db.query("DELETE FROM recetas");
};

const insertRecipes = async recipes => {
	for (const recipe of recipes) await db.query("INSERT INTO recetas (nombre, descripcion) VALUES (?, ?)", recipe);
	return await db.query("SELECT id, nombre FROM recetas");
};

const deleteContains = async () => {
	await db.query("DELETE FROM contiene");
};

const insertContains = async contains => {
	for (const contain of contains) await db.query("INSERT INTO contiene (id_receta, id_ingrediente, unidades) VALUES (?, ?, ?)", contain);
};

module.exports = { deleteUsers, deleteIngredients, insertIngredients, deleteRecipe, insertRecipes, deleteContains, insertContains };
