/* eslint-disable no-undef */
/* eslint-disable camelcase */

const assert = require("assert");
const { deleteUsers } = require("../testUtils");
const { baseUrl, port } = require("../../config/config");
const { badRequest, ok, conflict } = require("../../config/httpcodes");


describe("Rutas de usuario", () => {
	before(deleteUsers);
	afterEach(deleteUsers);
	const baseRoute = `http://${baseUrl}:${port}/usuarios/`;
	describe("Registro", () => {
		const route = `${baseRoute}/registro`;

		it("Debe registrar correctamente un usuario nuevo con contraseña correcta", async () => {
			const usuario = {
				username: "Luis",
				password: "12345678Aa:",
				confirm_password: "12345678Aa:"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, ok); // 200 es el codigo de que todo ha ido bien
		});

		it("No debe registrar un usuario con contraseñas no coincidentes", async () => {
			const usuario = {
				username: "Luis",
				password: "12345678Aa:",
				confirm_password: "12345679Aa:"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 400 es el codigo de que la petición era invalida
		});

		it("No debe registrar un usuario con contraseña demasiado corta", async () => {
			const usuario = {
				username: "Victor",
				password: "123bA-",
				confirm_password: "123bA-"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		it("No debe registrar un usuario con contraseña que supera el máximo permitido", async () => {
			const length = 50;
			const usuario = {
				username: "Victor",
				password: `123bA77-${ "1".repeat(length)}`,
				confirm_password: `123bA77-${ "1".repeat(length)}`
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		it("No debe registrarse un usuario ya existente", async () => {

			const usuario = {
				username: "Alfredo",
				password: "Ab12345-",
				confirm_password: "Ab12345-"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			const res2 = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, ok);
			assert.equal(res2.status, conflict);
		});

		it("No debe registrar un usuario con contraseña que no contenga una letra minúscula", async () => {
			const usuario = {
				username: "Victor",
				password: "123BA77-",
				confirm_password: "123BA77-"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		it("No debe registrar un usuario con contraseña que no contenga una letra mayúscula", async () => {
			const usuario = {
				username: "Victor",
				password: "123ba77-",
				confirm_password: "123ba77-"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		it("No debe registrar un usuario con contraseña que no contenga un número", async () => {
			const usuario = {
				username: "Victor",
				password: "aaabaBB-",
				confirm_password: "aaabaBB-"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		it("No debe registrar un usuario con contraseña que no contenga un carácter especial", async () => {
			const usuario = {
				username: "Victor",
				password: "123ba770",
				confirm_password: "123ba770"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		it("No debe registrar un usuario con una contraseña vacía", async () => {
			const usuario = {
				username: "Victor",
				password: "",
				confirm_password: ""
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		it("No debe registrar un usuario sin contraseña", async () => {
			const usuario = {
				username: "Luis",
				confirm_password: "12345679Aa:"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 400 es el codigo de que la petición era invalida
		});

		it("No debe registrar un usuario sin confirmacion de contraseña", async () => {
			const usuario = {
				username: "Luis",
				password: "12345679Aa:"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 400 es el codigo de que la petición era invalida
		});

		it("No debe registrar un usuario sin nombre", async () => {
			const usuario = {
				password: "12345679Aa:",
				confirm_password: "12345679Aa:"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 400 es el codigo de que la petición era invalida
		});

		it("No debe registrar un usuario con nombre vacio", async () => {
			const usuario = {
				username: "",
				password: "12345679Aa:",
				confirm_password: "12345679Aa:"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 400 es el codigo de que la petición era invalida
		});

		it("No debe registrar un usuario con contraseña vacia", async () => {
			const usuario = {
				username: "Luis",
				password: "",
				confirm_password: ""
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 400 es el codigo de que la petición era invalida
		});

		it("No debe registrar un usuario con un nombre con espacios", async () => {
			const usuario = {
				username: "Luis Jose",
				password: "12345678Aa:",
				confirm_password: "12345678Aa:"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 400 es el codigo de que la petición era invalida
		});

		it("No debe registrar un usuario con un nombre con tabulados", async () => {
			const usuario = {
				username: "Luis\tJose",
				password: "12345678Aa:",
				confirm_password: "12345678Aa:"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 400 es el codigo de que la petición era invalida
		});

		it("No debe registrar un usuario con una contraseña con espacios", async () => {
			const usuario = {
				username: "Luis Jose",
				password: "12345 678Aa:",
				confirm_password: "12345 678Aa:"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 400 es el codigo de que la petición era invalida
		});

		it("No debe registrar un usuario con una contraseña con tabulados", async () => {
			const usuario = {
				username: "Luis Jose",
				password: "12345\t678Aa:",
				confirm_password: "12345\t678Aa:"
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(usuario),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest); // 400 es el codigo de que la petición era invalida
		});
	});
});
