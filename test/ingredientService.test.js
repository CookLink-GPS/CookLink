/* eslint-disable no-undef */

const assert = require("assert");
const { createuser, deleteIngredients, deletePantryItems } = require("./testUtils");
const IngredientService = require("../services/ingredientService");

describe("Servicio Ingredient", () => {
	before(async () => {
		await createuser();
		await deleteIngredients();
		await deletePantryItems();
	});
	beforeEach(async () => {
		await createuser();
		await deleteIngredients();
		await deletePantryItems();
	});

	describe("processIngredient", () => {
		it("Debe sumar la cantidad si el ingrediente ya existe y las unidades coinciden", async () => {
			const data = { nombre: "Tomate", tipoUnidad: "kg", cantidad: 2, userId: 1 };

			const res1 = await IngredientService.processIngredient(data);
			const res2 = await IngredientService.processIngredient(data);

			assert.strictEqual(res1.action, "added");
			assert.strictEqual(res2.action, "updated");
		});

		it("Debe lanzar un error si el ingrediente ya existe pero las unidades no coinciden", async () => {
			const data1 = { nombre: "Tomate", tipoUnidad: "kg", cantidad: 2, userId: 1 };
			const data2 = { nombre: "Tomate", tipoUnidad: "g", cantidad: 3, userId: 1 };

			let good = false;
			try {
				await IngredientService.processIngredient(data1);
				await IngredientService.processIngredient(data2);
			}
			catch (err) {
				good = true;
			}
			assert.ok(good);
		});

		it("Debe lanzar un error si la cantidad es igual a cero", async () => {
			const data = { nombre: "Tomate", tipoUnidad: "kg", cantidad: 0, userId: 1 };

			let good = false;
			try {
				await IngredientService.processIngredient(data);
			}
			catch (err) {
				good = true;
			}
			assert.ok(good);
		});

		it("Debe lanzar un error si la cantidad es menor que cero", async () => {
			const data = { nombre: "Tomate", tipoUnidad: "kg", cantidad: -1, userId: 1 };

			let good = false;
			try {
				await IngredientService.processIngredient(data);
			}
			catch (err) {
				good = true;
			}
			assert.ok(good);
		});
	});
});
