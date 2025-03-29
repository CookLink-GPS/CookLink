/* eslint-disable no-undef */
/* eslint-disable no-magic-numbers */
const assert = require("node:assert");
const { deleteIngredients, deletePantryItems, insertIngredients } = require("./testUtils");
const Ingredient = require("../models/ingredientModel");

describe("Modelo ingrediente", () => {
	beforeEach(deleteIngredients);
	beforeEach(deletePantryItems);
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
