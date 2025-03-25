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

	add: ingredient => {
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
	 * @param {string} nombre - Nombre del ingrediente a buscar
	 * @returns {Promise<Object|null>} - Objeto con id y nombre o null si no existe
	 */
	findByName: async nombre => {
		try {
			console.log(`[Model] Buscando ingrediente: ${nombre}`);

			// Consulta optimizada para devolver id y nombre
			const rows = await db.query(
				`SELECT id, nombre FROM ${nombreTabla} WHERE nombre = ? LIMIT 1`,
				[ nombre ]
			);

			console.log(`[Model] Resultado findByName:`, rows[0]);

			// Si hay resultados, devuelve el objeto { id, nombre }, si no, null
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

	async getIngredient(id) {
		try {
			const sql = `SELECT * FROM ${nombreTabla} WHERE id = ?`;
			const rows = await db.promise().query(sql, [ id ]);
			let ingredient;
			// eslint-disable-next-line no-magic-numbers
			if (rows.length > 0) ingredient = rows[0];
			return ingredient;
		}
		catch (error) {
			throw new Error(`Error obteniendo el ingrediente ${id}`);
			/**
     * Crea un nuevo ingrediente (versión corregida)
     * @param {string} nombre - Nombre del ingrediente
     * @param {string} tipoUnidad - Tipo de unidad
     * @returns {Promise<{id: number, nombre: string, tipoUnidad: string}>}
     */
		}
	},

	create: async (nombre, tipoUnidad) => {
		try {
			console.log(`[Model] Creando ingrediente: ${nombre}`);

			// Versión segura sin desestructuración inmediata
			const result = await db.query(
				`INSERT INTO ${nombreTabla} (nombre, tipoUnidad) VALUES (?, ?)`,
				[ nombre, tipoUnidad ]
			);

			return result.insertId;

		}
		catch (error) {
			console.error("[Model] Error en create:", error);

			// Manejo específico para duplicados
			if (error.code === "ER_DUP_ENTRY") throw new Error("Este ingrediente ya existe");


			throw new Error("Error al crear ingrediente");
		}
	}
};

module.exports = Ingredient;
