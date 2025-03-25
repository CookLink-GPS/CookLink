/* eslint-disable no-undef */
const assert = require("node:assert");
const IngredientService = require("../services/ingredientService");
const { deleteIngredients, insertIngredients } = require("./testUtils");


describe("Servicio Ingrediente", () => {
	beforeEach(deleteIngredients);
	after(deleteIngredients);

	describe("Filtro de ingredientes", () => {
		const ingredientes = [
			[ "harina", "gramos" ],
			[ "arroz", "gramos" ],
			[ "leche", "litros" ],
			[ "harina de avena", "gramos" ]
		];

		it("Debe devolver todos los ingredientes si no se proporciona filtro", async () => {
			await insertIngredients(ingredientes);

			const res = await IngredientService.filterIngredients();

			ingredientes.forEach(ingrediente => {
				assert.ok(res.find(({ nombre, tipoUnidad }) => ingrediente[0] === nombre && ingrediente[1] === tipoUnidad));
			});
		});

		it("Debe devolver todos los ingredientes coincidentes", async () => {
			await insertIngredients(ingredientes);

			const res = await IngredientService.filterIngredients("harina");

			harinas = ingredientes.filter(([ nombre ]) => nombre.startsWith("harina"));

			harinas.forEach(ingrediente => {
				assert.ok(res.find(({ nombre, tipoUnidad }) => ingrediente[0] === nombre && ingrediente[1] === tipoUnidad));
			});

			assert.equal(res.length, harinas.length);
		});
	});
});
