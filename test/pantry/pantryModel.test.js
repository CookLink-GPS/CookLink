/* eslint-env mocha */
/* eslint-disable no-undef */

const assert = require("assert");
const Pantry = require("../../models/pantryModel");
const db = require("../../config/database");

/**
   * Hook que se ejecuta antes de las pruebas
   * Se encarga de limpiar la base de datos y poblarla con datos de prueba
   */
describe("Modelo despensa", () => {
	before(async () => {
		// Eliminar datos previos en las tablas relevantes
		await db.query("DELETE FROM despensa");
		await db.query("DELETE FROM ingredientes");
		await db.query("DELETE FROM usuarios");

		// Insertar un usuario de prueba
		await db.query("INSERT INTO usuarios (id, username, password) VALUES (1, \"test_user\", \"testpass\")");

		 // Insertar ingredientes de prueba
		await db.query(`
      INSERT INTO ingredientes (id, nombre, tipoUnidad) 
      VALUES 
        (100, "Harina", "kg"),
        (101, "Azúcar", "kg")
    `);
		// Insertar datos en la despensa del usuario de prueba
		await db.query(`
      INSERT INTO despensa (id_usuario, id_ingrediente, cantidad)
      VALUES
        (1, 100, 2),
        (1, 101, 1)
    `);
	});

	/**
	 * Hook que se ejecuta después de las pruebas
	 * Limpia la base de datos eliminando los datos insertados en la prueba
	 */
	after(async () => {
		await db.query("DELETE FROM despensa");
		await db.query("DELETE FROM ingredientes");
		await db.query("DELETE FROM usuarios");
	});

	 /**
	 * Prueba para verificar que el método getPantryFromUser devuelve correctamente
	 * los ingredientes almacenados en la despensa de un usuario específico
	 */
	describe("Obtener despensa de un usuario", () => {
		it("debe devolver 2 ingredientes para el usuario", async () => {
			const result = await Pantry.getPantryFromUser(1);
			assert.strictEqual(result.length, 2);
		});
	});
});
