/* eslint-disable no-undef */
const assert = require("node:assert");
const { baseUrl, port } = require("../../config/config");
const { deleteIngredients, deletePantry, deleteUsers, testtingSession } = require("../testUtils");
const { badRequest, ok } = require("../../config/httpcodes");
const UserService = require("../../services/userService");

describe("Rutas lista de la compra", () => {
	const baseRoute = `http://${baseUrl}:${port}/lista-compra`;
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

		// CL_011_02: Añadir un nuevo ingrediente correctamente
		it("Debe agregar un nuevo ingrediente correctamente a la lista de la compra cuando se introduce un nombre, unidad y cantidad válidos", async () => {
			const usuario = { username: "user1", password: "12345678" };
			await UserService.login(usuario);
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: 10
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, ok);
		});
	});

});
