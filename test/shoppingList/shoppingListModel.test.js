/* eslint-disable indent */
/* eslint-env mocha */
/* eslint-disable no-undef */
require("dotenv").config({ path: ".env.test" });
require("dotenv").config();

const assert = require("assert");
const db = require("../../config/database");
const ShoppingList = require("../../models/shoppingListModel");

describe("Modelo lista_compra", () => {

	// Antes de todas las pruebas: limpiar la base de datos y añadir datos iniciales
	before(async () => {
		await db.query("SET FOREIGN_KEY_CHECKS = 0");
		await db.query("DELETE FROM lista_compra");
		await db.query("DELETE FROM ingredientes");
		await db.query("DELETE FROM usuarios");
		await db.query("SET FOREIGN_KEY_CHECKS = 1");

		// Inserta un usuario y un ingrediente de prueba
		await db.query("INSERT INTO usuarios (id, username, password) VALUES (1, 'testuser', '1234')");
		await db.query("INSERT INTO ingredientes (id, nombre, tipoUnidad) VALUES (200, 'tomate', 'gramos')");
	});

	// Después de todas las pruebas: limpiar la base de datos nuevamente
	after(async () => {
		await db.query("SET FOREIGN_KEY_CHECKS = 0");
		await db.query("DELETE FROM lista_compra");
		await db.query("DELETE FROM ingredientes");
		await db.query("DELETE FROM usuarios");
		await db.query("SET FOREIGN_KEY_CHECKS = 1");
	});

	// Prueba unitaria
	it("debe insertar un ingrediente nuevo en la lista de la compra", async () => {
		// Insertamos en la lista
		await ShoppingList.addItem(1, 200, 150, "gramos");

		// Obtiene el ítem insertado
		const result = await ShoppingList.getItem(1, 200);

		// Comprobamos que se insertó correctamente
		assert.strictEqual(result.cantidad, 150);
		assert.strictEqual(result.unidad_medida, "gramos");
	});

	// Grupo de pruebas para actualizar cantidades
	describe("Actualizar cantidad de ingredientes", () => {
		it("Debe actualizar correctamente la cantidad", async () => {
			// Obtiene el ítem actual
			let existe = await ShoppingList.getItem(1, 200);

			// Actualiza la cantidad
			await ShoppingList.updateQuantity(existe.id_lista_compra, 100);

			// Vuelve a obtenerlo y verifica
			existe = await ShoppingList.getItem(1, 200);

			assert.equal(existe.cantidad, 100);
		});

	});

	// Grupo de pruebas para buscar por ID
	describe("Buscar por id", () => {
		it("Busca por id correctamente", async () => {
			const existe = await ShoppingList.getItem(1, 200);
			const filaListaCompra = await ShoppingList.getById(existe.id_lista_compra);

			// Verifica que coincidan los datos
			assert.equal(filaListaCompra.id_usuario, 1);
			assert.equal(filaListaCompra.id_ingrediente, 200);
		});
	});

	// Grupo de pruebas para eliminar elementos
	describe("Borrar de la lista", () => {
		it("Borrar de la lista correctamente", async () => {
			let existe = await ShoppingList.getItem(1, 200);

			// Elimina el ítem
			await ShoppingList.deleteItem(existe.id_lista_compra);

			// Intenta obtenerlo nuevamente
			existe = await ShoppingList.getById(existe.id_lista_compra);

			// Verifica que ya no exista
			assert(!existe);
		});

		it("Borrar un elemento inexistente", async () => {
			try {
			// Intenta borrar un ID que no existe
			await ShoppingList.deleteItem(-1);
			}
			catch (err) {
				console.log(err.message);
			}
		});
	});
});
