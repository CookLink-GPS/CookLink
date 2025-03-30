/* eslint-env mocha */
/* eslint-disable no-undef */
/* eslint-disable no-magic-numbers */
const assert = require("assert");
const Pantry = require("../models/pantryModel");
const db = require("../config/database");

describe("Modelo despensa", () => {
	before(async () => {
		await db.query("DELETE FROM despensa");
		await db.query("DELETE FROM ingredientes");
		await db.query("DELETE FROM usuarios");

		await db.query("INSERT INTO usuarios (id, username, password) VALUES (1, \"test_user\", \"testpass\")");

		await db.query(`
      INSERT INTO ingredientes (id, nombre, tipoUnidad) 
      VALUES 
        (100, "Harina", "kg"),
        (101, "Azúcar", "kg")
    `);

		await db.query(`
      INSERT INTO despensa (id_usuario, id_ingrediente, cantidad)
      VALUES
        (1, 100, 2),
        (1, 101, 1)
    `);
	});

	after(async () => {
		await db.query("DELETE FROM despensa");
		await db.query("DELETE FROM ingredientes");
		await db.query("DELETE FROM usuarios");
	});

	describe("Obtener despensa de un usuario", () => {
		it("debe devolver 2 ingredientes para el usuario", async () => {
			const result = await Pantry.getPantryFromUser(1);
			assert.strictEqual(result.length, 2);
		});
	});
});
