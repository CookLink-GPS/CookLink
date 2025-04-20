/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
const assert = require("node:assert");
const { deleteIngredients, insertIngredients } = require("./testUtils");
const Ingredient = require("../models/ingredientModel");

describe("Modelo ingrediente", () => {
	beforeEach(deleteIngredients);
	after(deleteIngredients);

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

			assert.ok(Array.isArray(res), "Debe seguir siendo un array");
			assert.strictEqual(res.length, 0, "Array debe venir vacío cuando no hay filas");
		});
	});
});
