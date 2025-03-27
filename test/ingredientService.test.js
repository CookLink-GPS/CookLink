/* eslint-disable no-undef */
const assert = require("node:assert");
const IngredientService = require("../services/ingredientService");
const { deleteIngredients, insertIngredients } = require("./testUtils");


describe("Servicio Ingrediente", () => {
	beforeEach(async () => {
		await deleteIngredients();
		await deletePantryItems();
	});
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
