/* eslint-disable no-undef */
const assert = require("node:assert");
const { baseUrl, port } = require("../../config/config");
const { deleteIngredients, deletePantry, deleteUsers, testtingSession, deleteShoppingList, insertIngredients } = require("../testUtils");
const { badRequest, ok } = require("../../config/httpcodes");
require("dotenv").config({ path: ".env.test" });
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);

// Const UserService = require("../../services/userService");

describe("Rutas lista de la compra", () => {
	const baseRoute = `http://${baseUrl}:${port}/lista-compra`;
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

	describe("Agregar ingrediente", () => {
		const route = `${baseRoute}/anyadir`;

		// CL_011_02: Añadir un nuevo ingrediente correctamente, que ya existe en la bbdd de ingredientes
		it("Debe agregar un nuevo ingrediente correctamente a la lista de la compra cuando se introduce un nombre, unidad y cantidad válidos", async () => {

			const ingrediente = {
				nombre: "Tomate",
				unidad: "kg",
				cantidad: 10
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, ok);
		});

		// CL_011_03: Error si falta algún campo
		it("No debe agregar el ingrediente si falta algún campo", async () => {
			const ingrediente = {
				nombre: "",
				unidad: "kg",
				cantidad: 2
			};

			const ingrediente2 = {
				nombre: "Tomate",
				unidad: "",
				cantidad: 2
			};
			const ingrediente3 = {
				nombre: "Tomate",
				unidad: "kg",
				cantidad: null
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			const res2 = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente2),
				headers: { "Content-Type": "application/json" }
			});

			const res3 = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente3),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
			assert.equal(res2.status, badRequest);
			assert.equal(res3.status, badRequest);
		});

		// CL_011_04: Error si la cantidad no es numérica
		it("No debe agregar el ingrediente si la cantidad no es numérica", async () => {
			const ingrediente = {
				nombre: "Tomate",
				unidad: "kg",
				cantidad: "q"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		// CL_011_04: Error si la cantidad es menor que cero
		it("No debe agregar el ingrediente si la cantidad es menor que cero", async () => {
			const ingrediente = {
				nombre: "Tomate",
				unidad: "kg",
				cantidad: -1
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		// CL_011_04: Error si la cantidad es igual a cero
		it("No debe agregar el ingrediente si la cantidad es igual a cero", async () => {
			const ingrediente = {
				nombre: "Tomate",
				unidad: "kg",
				cantidad: 0
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		// CL_011_05: Error si la unidad no es válida
		it("No debe agregar el ingrediente si la unidad no es válida", async () => {
			const ingrediente = {
				nombre: "Tomate",
				unidad: "invalidUnit",
				cantidad: 2
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		// CL_011_06: Sumar la cantidad si el ingrediente ya existe en la lista de la compra
		it("Debe sumar la cantidad si el ingrediente ya existe en la lista de la compra", async () => {

			const ingrediente = {
				nombre: "Tomate",
				unidad: "kg",
				cantidad: 10
			};

			await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});
			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, ok);
		});

		it("Debe dar de alta el ingrediente si no existe y añadirlo a la lista de la compra", async () => {

			const ingrediente = {
				nombre: "TomateInexistente",
				unidad: "kg",
				cantidad: 10
			};
			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});
			assert.equal(res.status, ok);
		});

		it("Debe lanzar un error si el ingrediente ya existe pero las unidades no coinciden", async () => {

			const ingrediente = {
				nombre: "Tomate",
				unidad: "kg",
				cantidad: 10
			};
			const ingrediente2 = {
				nombre: "Tomate",
				unidad: "litros",
				cantidad: 10
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			const res2 = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente2),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, ok);
			assert.equal(res2.status, badRequest);
		});
	});
	// TEST DE INTEGRACION HU_012 VER INGREDIENTES EN LA LISTA DE COMPRAS
	describe("Ver ingredientes de la lista de la compra", () => {
		const route = `${baseRoute}/ver`;

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

		});

		it("Debe devolver un listado de ingredientes ordenado alfabéticamente si hay elementos en la lista", async () => {
			await fetch(`${baseRoute}/anyadir`, {
				method: "POST",
				body: JSON.stringify({ nombre: "Leche", unidad: "litros", cantidad: 2 }),
				headers: { "Content-Type": "application/json" }
			});

			await fetch(`${baseRoute}/anyadir`, {
				method: "POST",
				body: JSON.stringify({ nombre: "Arroz", unidad: "gramos", cantidad: 500 }),
				headers: { "Content-Type": "application/json" }
			});

			const res = await fetch(route);
			const data = await res.json();

			assert.equal(res.status, 200);
			assert.ok(Array.isArray(data));
			assert.equal(data.length, 2);
			assert.deepStrictEqual(data.map(i => i.nombre), [ "Arroz", "Leche" ]);
		});

		it("Debe devolver un mensaje si la lista de la compra está vacía", async () => {
			await deleteShoppingList();

			const res = await fetch(route);
			const data = await res.json();

			assert.equal(res.status, 200);
			assert.deepEqual(data, { mensaje: "No hay ningún ingrediente en la lista de la compra." });
		});
	});


});
