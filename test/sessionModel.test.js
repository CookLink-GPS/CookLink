/* eslint-disable no-undef */

const assert = require("assert");
// Const bcrypt = require("bcrypt");
const { deleteUsers, createTestUsers } = require("./testUtils");
const User = require("../models/userModel");


describe("Modelo usuario", () => {
	before(deleteUsers); // Antes de todos los test borramos usuarios
	before(createTestUsers); // Creamos usuarios de prueba
	beforeEach(deleteUsers); // Despues de cada test borramos usuarios

	describe("Registro", () => {


		it("✅ Inicio de sesión con credenciales válidas", async () => {
			const usuario = {
				username: "user1",
				password: "12345678"
			};

			let good = true;

			try {
				const result = await User.inicio(usuario);
				assert.ok(result); // El usuario debería existir
				assert.strictEqual(result.username, usuario.username); // Verificamos que el nombre de usuario sea correcto
				assert.strictEqual(result.password, usuario.password); // Verificamos que la contraseña sea correcta
			}
			catch (err) {
				good = false;
			}

			assert.ok(good);
		});


	});
});
