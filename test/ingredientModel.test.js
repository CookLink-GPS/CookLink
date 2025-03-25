/* eslint-disable no-undef */
const assert = require("node:assert");
const { deleteIngredients } = require("./testUtils");
const db = require("../config/database");
const Ingredient = require("../models/ingredientModel");

describe("Modelo ingrediente", () => {
	beforeEach(deleteIngredients);
	after(deleteIngredients);

	describe("Obtener todos los ingredientes", () => {
		it("Debe devolver todos los ingredientes", async () => {
			const ingredientes = [
				[ "harina", "gramos" ],
				[ "arroz", "gramos" ],
				[ "leche", "litros" ]
			];

			for (ingrediente of ingredientes) await db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES (?, ?)", ingrediente);

			const res = await Ingredient.getAllIngredients();

			ingredientes.forEach(ingrediente => {
				assert.ok(res.find(({ nombre, tipoUnidad }) => ingrediente[0] === nombre && ingrediente[1] === tipoUnidad));
			});
		});
	});
});
