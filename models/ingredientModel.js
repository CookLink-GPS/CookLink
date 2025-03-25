const db = require("../config/database");

const nombreTabla = "ingredientes";

const Ingredient = {

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
			console.error("[Model] Error en findByName:", error);
			return null; // En caso de error, asumimos que no existe
		}
	},

	/**
     * Crea un nuevo ingrediente (versión corregida)
     * @param {string} nombre - Nombre del ingrediente
     * @param {string} tipoUnidad - Tipo de unidad
     * @returns {Promise<{id: number, nombre: string, tipoUnidad: string}>}
     */
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

// Tabla base datos
// CREATE TABLE ingredientes (
//     Id INT AUTO_INCREMENT PRIMARY KEY,       -- Identificador único
//     Nombre VARCHAR(100) NOT NULL,            -- Nombre del ingrediente
//     TipoUnidad VARCHAR(50) NOT NULL          -- Tipo de unidad (gramos, ml, etc.)
// );

