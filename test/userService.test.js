/* eslint-disable no-undef */

const assert = require("assert");
const UserService = require("../services/userService"); // Asegúrate de que el path es correcto
const { deleteUsers, testtingSession } = require("./testUtils");

describe("[Service] Servicio de usuario", () => {


	describe("[Service] Inicio de sesión", () => {
		before(testtingSession);
		after(deleteUsers);

		it("✅ Inicio de sesión con credenciales válidas", async () => {
			const usuario = { username: "user1", password: "12345678" }; // Usuario registrado y contraseña correcta
			let userDB;
			good = true;
			try {
				userDB = await UserService.login(usuario);
			}
			catch (error) {
				good = false;
				assert.fail("Debería haberse podido iniciar sesión");
			}

			assert.ok(good);
			assert.equal(userDB.username, usuario.username);
		});

		it("❌ No debe iniciar sesión sin nombre de usuario", async () => {
			const usuario = { password: "12345678" }; // Faltando 'username'

			good = false;
			try {
				await UserService.login(usuario);
			}
			catch (error) {
				good = true;
			}

			assert.ok(good, "Debería haber lanzado un error por falta de nombre de usuario");
		});

		it("❌ No debe iniciar sesión sin contraseña", async () => {
			const usuario = { username: "user1" }; // Faltando 'password'

			good = false;
			try {
				await UserService.login(usuario);
			}
			catch (error) {
				good = true;
				assert.equal(error.message, "Falta la contraseña");
			}

			assert.ok(good, "Debería haber lanzado un error por falta de contraseña");
		});

		it("❌ No debe iniciar sesión con usuario no registrado", async () => {
			const usuario = { username: "nonExistentUser", password: "12345678" }; // Usuario no registrado

			good = false;
			try {
				await UserService.login(usuario);
			}
			catch (error) {
				good = true;
			}

			assert.ok(good, "Debería haber lanzado un error porque el usuario no está registrado");
		});

		it("❌ Manejo de errores generales", async () => {
			const usuario = { username: "user1", password: "incorrectPassword" }; // Contraseña incorrecta

			good = false;
			try {
				await UserService.login(usuario);
			}
			catch (error) {
				good = true;
				// Asumimos que en este caso se maneja un error específico de modelo en el servicio
			}

			assert.ok(good, "Debería haber lanzado un error por contraseña incorrecta");
		});

	});
});
