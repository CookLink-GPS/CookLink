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
});
