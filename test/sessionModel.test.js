/* eslint-disable no-undef */

const assert = require("assert");
const { deleteUsers, createTestUsers } = require("./testUtils");
const User = require("../models/userModel");


describe("Modelo usuario", () => {
	before(deleteUsers); // Antes de todos los test
	before(createTestUsers);
	// BeforeEach(deleteUsers); // Despues de cada test

	describe("Registro", () => {


		it("Inicio de sesión con credenciales válidas", async () => {
			const usuario = {
				username: "user1",
				password: "12345678"
			};

			let good = true;

			try {
				await User.inicio(usuario.username, usuario.password);
			}
			catch (err) {
				good = false;
			}

			assert.ok(good);
		});


	});
});
