const db = require("../config/database");
const nombreTabla = "ingredientes";

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

