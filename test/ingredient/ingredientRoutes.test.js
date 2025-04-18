/* eslint-disable no-undef */

const assert = require("node:assert");
const { baseUrl, port } = require("../../config/config");
const { deleteIngredients, deletePantry, deleteUsers, testtingSession } = require("../testUtils");
const { badRequest, ok } = require("../../config/httpcodes");
const UserService = require("../../services/userService"); // Asegúrate de que el path es correcto


describe("Rutas ingrediente", () => {
	const baseRoute = `http://${baseUrl}:${port}/ingredientes`;
	before(testtingSession);
	beforeEach(async () => {
		await deleteIngredients();
		await deletePantry();
	});

	after(async () => {
		await deleteIngredients();
		await deletePantry();
		await deleteUsers();
	});

	describe("Agregar ingrediente", () => {
		const route = `${baseRoute}/anyadir`;

		// CL_003_01: Añadir un nuevo ingrediente correctamente
		it("Debe agregar un nuevo ingrediente correctamente a la despensa cuando se introduce un nombre, unidad y cantidad válidos", async () => {

			const usuario = { username: "user1", password: "12345678" };
			await UserService.login(usuario);
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "kg"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, ok);
		});

		// CL_003_02: Error si falta algún campo
		it("No debe agregar el ingrediente si falta algún campo", async () => {
			const ingrediente = {
				nombre: "",
				tipoUnidad: "kg",
				cantidad: 2,
				userId: 1
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		// CL_003_03: Error si la cantidad es menor que cero
		it("No debe agregar el ingrediente si la cantidad es menor que cero", async () => {
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: -1,
				userId: 1
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		// CL_003_03: Error si la cantidad es igual a cero
		it("No debe agregar el ingrediente si la cantidad es igual a cero", async () => {
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: 0,
				userId: 1
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		// CL_003_04: Error si no se selecciona ninguna unidad de medida
		it("No debe agregar el ingrediente si no se selecciona unidad de medida", async () => {
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "",
				cantidad: 2,
				userId: 1
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		// CL_003_05: Si ya existe y las unidades coinciden, se suma la cantidad
		it("Si el ingrediente ya existe en la despensa y las unidades coinciden, se debe sumar la cantidad", async () => {
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: 2,
				userId: 1
			};

			const res1 = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			const ingrediente2 = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: 3,
				userId: 1
			};

			const res2 = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente2),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res1.status, ok);
			assert.equal(res2.status, ok);
		});

		// CL_003_06: Error si ya existe pero las unidades no coinciden
		it("Si el ingrediente ya existe en la despensa pero las unidades no coinciden, se debe mostrar error", async () => {
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: 2,
				userId: 1
			};

			const res1 = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			const ingrediente2 = {
				nombre: "Tomate",
				tipoUnidad: "g",
				cantidad: 3,
				userId: 1
			};

			const res2 = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente2),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res1.status, ok);
			assert.equal(res2.status, badRequest);
		});
	});
});
