/* eslint-env mocha */
/* eslint-disable no-undef */
require("dotenv").config({ path: ".env.test" });
require("dotenv").config();

const assert = require("assert");
const db = require("../../config/database");
const ShoppingList = require("../../models/shoppingListModel");

describe("Modelo lista_compra", () => {
	before(async () => {
		await db.query("SET FOREIGN_KEY_CHECKS = 0");
		await db.query("DELETE FROM lista_compra");
		await db.query("DELETE FROM ingredientes");
		await db.query("DELETE FROM usuarios");
		await db.query("SET FOREIGN_KEY_CHECKS = 1");

		await db.query("INSERT INTO usuarios (id, username, password) VALUES (1, 'testuser', '1234')");
		await db.query("INSERT INTO ingredientes (id, nombre, tipoUnidad) VALUES (200, 'tomate', 'gramos')");
	});

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

		// Obtenemos lo que insertamos
		const result = await ShoppingList.getItem(1, 200);

		// Comprobamos que se insertó correctamente
		assert.strictEqual(result.cantidad, 150);
		assert.strictEqual(result.unidad_medida, "gramos");
	});
});
