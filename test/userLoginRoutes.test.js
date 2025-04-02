/* eslint-disable no-undef */


const assert = require("assert");
const { deleteUsers, testtingSession } = require("./testUtils");
const { baseUrl, port } = require("../config/config");
const { ok, badRequest, unauthorized } = require("../config/httpcodes");


describe("[ROUTE2] Rutas de usuario", () => {
	before(testtingSession);
	after(deleteUsers);
	const baseRoute = `http://${baseUrl}:${port}/users/`;
	describe(" [ROUTE2] Login", () => {
		const route = `${baseRoute}login`;

		it("[ROUTE2] ✅ Debe iniciar correctamente un usuario", async () => {
			const usuario = { username: "user1", password: "12345678" };

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, ok); // 200 es el código de éxito
		});

		it("[ROUTE2] ❌ No debe iniciar correctamente con contraseña incorrecta", async () => {
			const usuario = { username: "user1", password: "123456789" };

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, unauthorized); // 401 es el código de éxito
		});

		it("[ROUTE2] ❌ No Debe iniciar correctamente usuario inexistente", async () => {
			const usuario = { username: "no_existe", password: "12345678" };

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, unauthorized); // 401 es el código de éxito
		});

		it("[ROUTE2] ❌ No Debe iniciar correctamente sin nombre de usuario", async () => {
			const usuario = { password: "12345678" };

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 401 es el código de éxito
		});

		it("[ROUTE2] ❌ No Debe iniciar correctamente sin contraseña", async () => {
			const usuario = { username: "user1" };

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 401 es el código de éxito
		});

		it("[ROUTE2] ❌ No Debe iniciar correctamente campos vacios", async () => {
			const usuario = { };

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 401 es el código de éxito
		});

		it("[ROUTE2] ❌ No Debe iniciar correctamente campos incorrectos en el JSON", async () => {
			const usuario = { gsername: "user1", gassword: "12345678" };

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 401 es el código de éxito
		});


	});
});
