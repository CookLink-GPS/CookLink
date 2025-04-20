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

	describe("Obtener todos los ingredientes", () => {
		const ingredientes = [
			[ "harina", "gramos" ],
			[ "arroz", "gramos" ],
			[ "leche", "litros" ]
		];

		it("Debe devolver todos los ingredientes", async () => {
			await insertIngredients(ingredientes);

			const res = await Ingredient.getAllIngredients();

			ingredientes.forEach(ingrediente => {
				assert.ok(res.find(({ nombre, tipoUnidad }) => ingrediente[0] === nombre && ingrediente[1] === tipoUnidad));
			});
		});
	});

	describe("Añadir ingrediente de la base de datos a la despensa", () => {
		const ingredientes = [
			[ "harina", "gramos" ],
			[ "arroz", "gramos" ],
			[ "leche", "litros" ]
		];

		it("Debe añadir el ingrediente seleccionado de la base de datos a la despensa", async () => {
			await insertIngredients(ingredientes);
			const all = await Ingredient.getAllIngredients();
			const firstId = all[0].id;

			const res = await Ingredient.getIngredient(firstId);

			assert.strictEqual(res.id, firstId);
			assert.strictEqual(res.nombre, ingredientes[0][0]);
			assert.strictEqual(res.tipoUnidad, ingredientes[0][1]);
		});

		it("Debe devolver un error si no selecciona ningun ingrediente de la base de datos", async () => {
			await insertIngredients(ingredientes);
			const all = await Ingredient.getAllIngredients();
			const maxId = all.reduce((m, r) => r.id > m ? r.id : m, 0);
			const missingId = maxId + 1;

			const res = await Ingredient.getIngredient(missingId);
			assert.strictEqual(res, undefined, "Debe devolver undefined cuando no hay filas seleccionadas");
		});
	});
});
