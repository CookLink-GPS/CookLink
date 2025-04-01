/* eslint-disable no-undef */

const assert = require("assert");
const { deleteUsers, testtingSession } = require("./testUtils");
const User = require("../models/userModel");

describe("Modelo usuario", () => {
	describe("Inicio de sesion", () => {
		before(testtingSession);
		after(deleteUsers);

		it("✅ Inicio de sesión con credenciales válidas", async () => {
			const usuario = {
				username: "user1",
				password: "12345678"
			};

			let good = true;

			try {
				const result = await User.inicio(usuario);
				assert.ok(result);
				assert.equal(result.username, usuario.username); // Verificamos que el nombre de usuario sea correcto
			}
			catch (err) {
				good = false;
			}

			assert.ok(good);
		});

		it("❌ No debe iniciar sesión con contraseña incorrecta", async () => {
			const usuario = {
				username: "user1",
				password: "123456789"
			};

			good = false;
			try {
				await User.inicio(usuario);
			}
			catch (error) {
				good = true;
			}

			assert.ok(good);
		});

		it("❌ No debe iniciar sesión con nombre incorrecto", async () => {
			const usuario = {
				username: "nombre_incorrecto",
				password: "12345678"
			};

			good = false;
			try {
				await User.inicio(usuario);
			}
			catch (error) {
				good = true;
			}

			assert.ok(good);
		});

		it("❌ No debe iniciar sesión sin nombre", async () => {
			const usuario = { password: "12345678" };

			good = false;
			try {
				await User.inicio(usuario);
			}
			catch (error) {
				good = true;
			}

			assert.ok(good);
		});

		it("❌ No debe iniciar sesión sin contraseña", async () => {
			const usuario = { username: "user1" };

			good = false;
			try {
				await User.inicio(usuario);
			}
			catch (error) {
				good = true;
			}

			assert.ok(good);
		});

	});
});
