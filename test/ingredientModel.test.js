/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */

const assert = require("assert");
const { createuser, deleteIngredients, deletePantryItems } = require("./testUtils");
const Ingredient = require("../models/ingredientModel");

describe("Modelo Ingrediente", () => {
	before(createuser);
	before(deleteIngredients);
	before(deletePantryItems);
	beforeEach(deleteIngredients);
	beforeEach(deletePantryItems);
	beforeEach(createuser);

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
