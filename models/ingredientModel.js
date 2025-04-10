const db = require("../config/database");
const { ingredientQueries } = require("../config/queries");

/**
 *
 * @typedef Ingredient
 * @property {Number} Id
 * @property {String} nombre
 * @property {String} tipoUnidad
 *
 */
const Ingredient = {
	/**
	 * Busca un ingrediente por nombre
	 *
	 * @param {string} name - Nombre del ingrediente a buscar
	 * @returns {Promise<Object|null>} - Objeto con id y nombre o null si no existe
	 */
	async findByName(name) {
		try {
			const [ result ] = await db.query(
				ingredientQueries.findByName,
				[ name ]
			);

			return result;
		}
		catch (error) {
			throw Error("Error al encontrar ingrediente");
		}
	},

	/**
	 * Returns all ingredients
	 *
	 * @async
	 * @returns {Promise<Ingredient[]>}
	 */
	async getAllIngredients() {
		try {
			const res = await db.query(ingredientQueries.getAll);
			return res.map(row => ({ ...row }));
		}
		catch (error) {
			throw Error("Error al obtener los ingredientes");
		}
	},

	/**
	 * Elimina un ingrediente por su ID
	 *
	 * @param {number} id - ID del ingrediente a eliminar
	 * @returns {Promise<boolean>} - True si se eliminó correctamente, false si no se encontró
	 */
	async getIngredient(id) {
		try {
			const [ ingredient ] = await db.query(ingredientQueries.getById, [ id ]);
			return ingredient;
		}
		catch (error) {
			console.error(error.message);
			throw new Error(`Error obteniendo el ingrediente ${id}`);
		}
	},

	/**
     * Crea un nuevo ingrediente (versión corregida)
	 *
     * @param {string} name - Nombre del ingrediente
     * @param {string} unit - Tipo de unidad
     * @returns {Promise<{id: number, nombre: string, tipoUnidad: string}>}
     */
	async create(name, unit) {
		try {
			if (!name || name.trim() === "") throw new Error("El nombre del ingrediente no puede estar vacío");
			if (!unit || unit.trim() === "") throw new Error("El tipo de unidad no puede estar vacío");

			const result = await db.query(
				ingredientQueries.create,
				[ name, unit ]
			);
			return result.insertId;
		}
		catch (error) {
			console.error(error.message);
			if (error.code === "ER_DUP_ENTRY") throw new Error("Este ingrediente ya existe");
			throw new Error("Error al crear ingrediente");
		}
	}
};

module.exports = Ingredient;
