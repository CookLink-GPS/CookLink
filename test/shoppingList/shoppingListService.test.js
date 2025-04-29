/* eslint-disable no-undef */

const assert = require("node:assert");
const ShoppingListService = require("../../services/shoppingListService");
const { deleteIngredients, insertIngredients, testtingSession, deletePantry, deleteUsers, deleteShoppingList } = require("../testUtils");
const PantryModel = require("../../models/pantryModel");

describe("Servicio Lista de Compra", () => {
	before(testtingSession);
	beforeEach(async () => {
		await deleteShoppingList();
		await deletePantry();
		await deleteIngredients();
		await insertIngredients([
			[ "Tomate", "kg" ],
			[ "Arroz", "gramos" ],
			[ "Leche", "litros" ]
		]);

	});

	after(async () => {
		await deleteShoppingList();
		await deleteIngredients();
		await deletePantry();
		await deleteUsers();
	});

	describe("Añade ingrediente a lista de la compra", () => {
		// CL_011_02: Añadir un nuevo ingrediente correctamente
		it("Debe añadir un ingrediente nuevo a la lista de la compra", async () => {
			const data = { userId: 1, name: "Tomate", quantity: 2, unit: "kg", validUnits: [ "kg", "gramos" ] };

			const res = await ShoppingListService.addIngredient(
				data.userId,
				data.name,
				data.quantity,
				data.unit,
				data.validUnits
			);
			assert.equal(res.action, "added");

		});

		// CL_011_06: Añadir un ingrediente ya existente
		it("Debe sumar la cantidad si el ingrediente ya existe en la lista de la compra", async () => {
			const data = { userId: 1, name: "Tomate", quantity: 2, unit: "kg", validUnits: [ "kg", "gramos" ] };

			const res1 = await ShoppingListService.addIngredient(
				data.userId,
				data.name,
				data.quantity,
				data.unit,
				data.validUnits
			);

			const res2 = await ShoppingListService.addIngredient(
				data.userId,
				data.name,
				data.quantity,
				data.unit,
				data.validUnits
			);
			assert.equal(res1.action, "added");
			assert.equal(res2.action, "updated");
		});

		// CL_011_03: Alguno de los campos está vacío
		it("Debe lanzar un error si alguno de los campos está vacío", async () => {
			const data = { userId: 1, name: "", quantity: 2, unit: "kg", validUnits: [ "kg", "gramos" ] };

			let good = false;
			try {
				await ShoppingListService.addIngredient(
					data.userId,
					data.name,
					data.quantity,
					data.unit,
					data.validUnits
				);
			}
			catch (error) {
				good = true;
			}
			assert.ok(good);
		});

		// CL_011_04: La cantidad no es un número
		it("Debe lanzar un error si la cantidad no es un número", async () => {
			const data = { userId: 1, name: "Tomate", quantity: "q", unit: "kg", validUnits: [ "kg", "gramos" ] };

			let good = false;
			try {
				await ShoppingListService.addIngredient(
					data.userId,
					data.name,
					data.quantity,
					data.unit,
					data.validUnits
				);
			}
			catch (error) {
				good = true;
			}
			assert.ok(good);
		});

		// CL_011_04: La cantidad es igual a 0
		it("Debe lanzar un error si la cantidad es igual a 0", async () => {
			const data = { userId: 1, name: "Tomate", quantity: 0, unit: "kg", validUnits: [ "kg", "gramos" ] };

			let good = false;

			try {
				await ShoppingListService.addIngredient(
					data.userId,
					data.name,
					data.quantity,
					data.unit,
					data.validUnits
				);
			}
			catch (error) {
				good = true;
			}
			assert.ok(good);
		});

		// CL_011_04: La cantidad es menor que 0
		it("Debe lanzar un error si la cantidad es menor que 0", async () => {
			const data = { userId: 1, name: "Tomate", quantity: -1, unit: "kg", validUnits: [ "kg", "gramos" ] };

			let good = false;

			try {
				await ShoppingListService.addIngredient(
					data.userId,
					data.name,
					data.quantity,
					data.unit,
					data.validUnits
				);
			}
			catch (error) {
				good = true;
			}
			assert.ok(good);
		});

		// CL_011_05: La unidad no es válida
		it("Debe lanzar un error si la unidad no es válida", async () => {
			const data = { userId: 1, name: "Tomate", quantity: 2, unit: "invalidUnit", validUnits: [ "kg", "gramos" ] };

			let good = false;

			try {
				await ShoppingListService.addIngredient(
					data.userId,
					data.name,
					data.quantity,
					data.unit,
					data.validUnits
				);
			}
			catch (error) {
				good = true;
			}
			assert.ok(good);
		});

		it("Debe dar de alta el ingrediente si no existe y añadirlo a la lista de la compra", async () => {
			const data = { userId: 1, name: "NoExist", quantity: 2, unit: "kg", validUnits: [ "kg", "gramos" ] };


			const res =	await ShoppingListService.addIngredient(
				data.userId,
				data.name,
				data.quantity,
				data.unit,
				data.validUnits
			);

			assert.equal(res.action, "added");
		});

		it("Debe lanzar un error si el ingrediente ya existe pero las unidades no coinciden", async () => {
			const data1 = { userId: 1, name: "Tomate", quantity: 2, unit: "kg", validUnits: [ "kg", "gramos" ] };
			const data2 = { userId: 1, name: "Tomate", quantity: 2, unit: "gramos", validUnits: [ "kg", "gramos" ] };

			let good = false;

			try {
				await ShoppingListService.addIngredient(
					data1.userId,
					data1.name,
					data1.quantity,
					data1.unit,
					data1.validUnits
				);
				await ShoppingListService.addIngredient(
					data2.userId,
					data2.name,
					data2.quantity,
					data2.unit,
					data2.validUnits
				);
			}
			catch (error) {
				good = true;
			}
			assert.ok(good);
		});
	});

	// VER LISTA DE COMPRAS
	describe("Ver ingredientes de la lista de la compra", () => {

		// CL_012_01
		it("Debe devolver un listado de ingredientes ordenado alfabéticamente si hay elementos en la lista", async () => {
			await ShoppingListService.addIngredient(1, "Leche", 1, "litros", [ "litros", "gramos", "kg" ]);
			await ShoppingListService.addIngredient(1, "Arroz", 500, "gramos", [ "litros", "gramos", "kg" ]);

			const lista = await ShoppingListService.getList(1);


			assert.ok(Array.isArray(lista));
			assert.equal(lista.length, 2);
			assert.deepStrictEqual(lista.map(i => i.nombre), [ "Arroz", "Leche" ]);
		});

		// CL_012_02
		it("Debe devolver un mensaje si la lista de la compra está vacía", async () => {
			await deleteShoppingList();

			const lista = await ShoppingListService.getList(1);
			assert.deepStrictEqual(lista, []);
    });
  });

	// HU_015 – Marcar ingrediente como comprado en SERVICE
	describe("Marcar ingrediente como comprado en el servicio (HU_015)", () => {
		beforeEach(async () => {
			await deleteShoppingList();
			await deletePantry();
			await deleteIngredients();
			await insertIngredients([ [ "Tomate", "kg" ] ]);
			await ShoppingListService.addIngredient(1, "Tomate", 3, "kg", [ "kg" ]);
		});

		afterEach(async () => {
			await deleteShoppingList();
			await deletePantry();
			await deleteIngredients();
		});

		it("Debe eliminar el ingrediente de la lista y añadirlo a la despensa (Service)", async () => {
			const lista = await ShoppingListService.getList(1);
			const idListaCompra = lista[0].idListaCompra;

			await ShoppingListService.markAsBought(1, idListaCompra);

			const listaDespues = await ShoppingListService.getList(1);
			assert.deepStrictEqual(listaDespues, []); // La lista debe quedar vacía

			const pantry = await PantryModel.getPantryFromUser(1);
			assert.equal(pantry.length, 1);
			assert.equal(pantry[0].nombre_ingrediente, "Tomate");
			assert.equal(pantry[0].cantidad, 3);
		});
	});

});
