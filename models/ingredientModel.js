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
			const rows = await db.query(sql, [ id ]);
			let ingredient;
			// eslint-disable-next-line no-magic-numbers
			if (rows.length > 0) ingredient = rows[0];
			return ingredient;
		}
		catch (error) {
			console.error(error.message);
			throw new Error(`Error obteniendo el ingrediente ${id}`);
		}
	}
};

module.exports = Ingredient;
