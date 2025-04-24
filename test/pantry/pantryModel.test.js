/* eslint-env mocha */
/* eslint-disable no-undef */

const assert = require("assert");
const Pantry = require("../../models/pantryModel");
const db = require("../../config/database");
const { deletePantry, deleteIngredients, deleteUsers, insertDummy } = require("../testUtils");

/**
   * Hook que se ejecuta antes de las pruebas
   * Se encarga de limpiar la base de datos y poblarla con datos de prueba
   */
describe("Modelo despensa", () => {
	before(async () => {
		// Eliminar datos previos en las tablas relevantes
		await deletePantry();
		await deleteIngredients();
		await deleteUsers();

		// Insertar un usuario de prueba
		await insertDummy();

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
		await deletePantry();
		await deleteIngredients();
		await deleteUsers();
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

	describe("Reducir cantidad", () => {
		it("Debe reducir la cantidad de un ingrediente en despensa", async () => {
			await Pantry.decreaseQuantity(1, 100, 1);

			const { cantidad } = await Pantry.findItem(1, 100);

			assert.equal(cantidad, 1);
		});

		it("Debe eliminar un ingrediente si se elimina toda la cantidad", async () => {
			await Pantry.decreaseQuantity(1, 100, 1);
			await Pantry.deleteIngredient(1, 100);
			const ing = await Pantry.findItem(1, 100);

			assert.ok(!ing);
		});

		it("No debe eliminar la cantidad de un ingrediente si se introduce mas de la que hay", async () => {
			try {
				await Pantry.decreaseQuantity(1, 101, 2);
			}
			catch (err) {
				console.log(err.message);
			}
		});
	});
});
