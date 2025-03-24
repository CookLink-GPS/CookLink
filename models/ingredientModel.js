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
			console.log(error);
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
			console.log(error);
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
			console.log(error);
			throw Error("Error al obtener los ingredientes");
		}
	}
};

module.exports = Ingredient;

// Tabla base datos
// CREATE TABLE ingredientes (
//     Id INT AUTO_INCREMENT PRIMARY KEY,       -- Identificador único
//     Nombre VARCHAR(100) NOT NULL,            -- Nombre del ingrediente
//     Calorias INT NOT NULL,                   -- Cantidad de calorías
//     Categoria VARCHAR(50) NOT NULL,          -- Categoría del ingrediente
//     TipoUnidad VARCHAR(50) NOT NULL          -- Tipo de unidad (gramos, ml, etc.)
// );

