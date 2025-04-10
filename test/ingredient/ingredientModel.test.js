/* eslint-disable no-undef */

const assert = require("node:assert");
const { deleteIngredients, createuser, deletePantry, insertIngredients, deleteUsers } = require("../testUtils");
const Ingredient = require("../../models/ingredientModel");

describe("Modelo ingrediente", () => {
	before(async () => {
		await deleteUsers();
		await createuser();
	});
	beforeEach(async () => {
		await deletePantry();
		await deleteIngredients();
	});

	after(async () => {
		await deleteUsers();
		await deletePantry();
		await deleteIngredients();
	});

	describe("Obtener todos los ingredientes", () => {
		const ingredientes = [
			[ "harina", "gramos" ],
			[ "arroz", "gramos" ],
			[ "leche", "litros" ]
		];

		it("Debe devolver todos los ingredientes", async () => {
			await insertIngredients(ingredientes);
			const res = await Ingredient.getAllIngredients();
			assert.ok(Array.isArray(res));
		});
	});

	describe("Añadir ingrediente", () => {
		it("Debe crear correctamente un ingrediente nuevo con datos válidos", async () => {
			const nombre = "Tomate";
			const tipoUnidad = "kg";

			let good = true;
			let id;
			try {
				id = await Ingredient.create(nombre, tipoUnidad);
			}
			catch (err) {
				good = false;
			}

			assert.ok(good);
			assert.ok(id > 0);
		});

		it("No debe crear un ingrediente sin nombre", async () => {
			let good = false;
			try {
				await Ingredient.create("", "kg");
			}
			catch (err) {
				good = true;
			}
			assert.ok(good);
		});

		it("No debe crear un ingrediente sin unidad de medida", async () => {
			let good = false;
			try {
				await Ingredient.create("Tomate", "");
			}
			catch (err) {
				good = true;
			}
			assert.ok(good);
		});
	});
});
