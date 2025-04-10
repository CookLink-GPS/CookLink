const db = require("../config/database");
const nombreTabla = "ingredientes";

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
	 * Agrega un nuevo ingrediente a la base de datos
	 *
	 * @param {Object} ingredient - Objeto que contiene los datos del ingrediente
	 * @returns {Promise<number>} - ID del ingrediente recién agregado
	 */
	add(ingredient) {
		try {
			const sql = `INSERT INTO ${nombreTabla} (nombre) VALUES (?)`;
			return db.query(sql, [ ingredient ]);
		}
		catch (error) {
			throw Error("Error al agregar ingrediente");
		}
	},

	/**
	 * Busca un ingrediente por nombre (devuelve el id y el nombre si existe)
	 *
	 * @param {string} nombre - Nombre del ingrediente a buscar
	 * @returns {Promise<Object|null>} - Objeto con id y nombre o null si no existe
	 */
	async findByName(nombre) {
		try {
			const rows = await db.query(
				`SELECT id, nombre, tipoUnidad FROM ${nombreTabla} WHERE nombre = ? LIMIT 1`,
				[ nombre ]
			);
			const cero = 0;
			return rows.length > cero ? rows[0] : null;
		}
		catch (error) {
			throw Error("Error al agregar ingrediente");
		}
	},

	/**
	 * Description placeholder
	 *
	 * @async
	 * @returns {Promise<Ingredient[]>}
	 */
	async getAllIngredients() {
		try {
			const sql = `SELECT * FROM ${nombreTabla}`;
			const res = await db.query(sql);
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
			const sql = `SELECT * FROM ${nombreTabla} WHERE id = ?`;
			const rows = await db.query(sql, [ id ]);
			let ingredient;
			if (rows.length > 0) ingredient = rows[0];
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
     * @param {string} nombre - Nombre del ingrediente
     * @param {string} tipoUnidad - Tipo de unidad
     * @returns {Promise<{id: number, nombre: string, tipoUnidad: string}>}
     */
	async create(nombre, tipoUnidad) {
		try {
			if (nombre === undefined || nombre === null || nombre.trim() === "") throw new Error("El nombre del ingrediente no puede estar vacío");
			if (tipoUnidad === undefined || tipoUnidad === null || tipoUnidad.trim() === "") throw new Error("El tipo de unidad no puede estar vacío");

			const result = await db.query(
				`INSERT INTO ${nombreTabla} (nombre, tipoUnidad) VALUES (?, ?)`,
				[ nombre, tipoUnidad ]
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
