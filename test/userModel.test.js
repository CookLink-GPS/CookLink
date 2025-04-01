/* eslint-disable no-undef */

const assert = require("assert");
const { deleteUsers, testtingSession } = require("./testUtils");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { saltRounds } = require("../config/config");

describe("Modelo usuario", () => {


	describe("Registro", () => {
		before(deleteUsers); // Antes de todos los test
		beforeEach(deleteUsers); // Despues de cada test

		it("Debe registrar correctamente un usuario nuevo con contraseña correcta", async () => {
			const usuario = {
				username: "Luis",
				password: "12345678"
			};

			let good = true;

			try {
				await User.registro(usuario);
			}
			catch (err) {
				good = false;
			}

			assert.ok(good);
		});

		it("No debe registrar un usuario repetido", async () => {
			const usuario = {
				username: "Paula",
				password: "12345678"
			};

			await User.registro(usuario);

			let good = false;
			try {
				await User.registro(usuario);
			}
			catch (err) {
				console.log(err.code);
				good = true;
			}

			assert.ok(good);
		});

		it("No debe registrar un usuario sin nombre", async () => {
			const usuario = { password: "12345678" };

			let good = false;
			try {
				await User.registro(usuario);
			}
			catch (err) {
				good = true;
			}

			assert.ok(good);
		});

		it("No debe registrar un usuario sin contraseña", async () => {
			const usuario = { username: "Paula" };

			let good = false;
			try {
				await User.registro(usuario);
			}
			catch (err) {
				console.log(err);
				good = true;
			}

			assert.ok(good);
		});

		it("No debe registrar un usuario con nombre vacio", async () => {
			const usuario = {
				username: "",
				password: "12345678"
			};

			let good = false;
			try {
				await User.registro(usuario);
			}
			catch (err) {
				console.log(err);
				good = true;
			}

			assert.ok(good);
		});

		it("No debe registrar un usuario con contraseña vacia", async () => {
			const usuario = {
				username: "Paula",
				password: ""
			};

			let good = false;
			try {
				await User.registro(usuario);
			}
			catch (err) {
				console.log(err);
				good = true;
			}

			assert.ok(good);
		});

		it("No debe registrar un usuario con nombre con espacios", async () => {
			const usuario = {
				username: "Luis Jose",
				password: "12345678"
			};

			let good = false;
			try {
				await User.registro(usuario);
			}
			catch (err) {
				console.log(err);
				good = true;
			}

			assert.ok(good);
		});

		it("No debe registrar un usuario con nombre con tabulados", async () => {
			const usuario = {
				username: "Luis\tJose",
				password: "12345678"
			};

			let good = false;
			try {
				await User.registro(usuario);
			}
			catch (err) {
				console.log(err);
				good = true;
			}

			assert.ok(good);
		});

		it("No debe registrar un usuario con contraseña con espacios", async () => {
			const usuario = {
				username: "Paula",
				password: "1234 5678"
			};

			let good = false;
			try {
				await User.registro(usuario);
			}
			catch (err) {
				console.log(err);
				good = true;
			}

			assert.ok(good);
		});

		it("No debe registrar un usuario con contraseña con tabulados", async () => {
			const usuario = {
				username: "Paula",
				password: "1234\t5678"
			};

			let good = false;
			try {
				await User.registro(usuario);
			}
			catch (err) {
				console.log(err);
				good = true;
			}

			assert.ok(good);
		});
	});


	describe("Inicio de sesion", () => {
		before(testtingSession);
		after(deleteUsers);

		it("✅ Inicio de sesión con credenciales válidas", async () => {
			const password = "12345678"; // Contraseña en texto plano
			const hashedPassword = await bcrypt.hash(password, saltRounds); // La hasheamos
			console.log("hashedPassword", hashedPassword); // Para ver el hash generado
			const usuario = {
				username: "user1",
				password: password
			};

			let good = true;

			try {
				const result = await User.inicio( usuario);
				assert.ok(result);
				assert.equal(result.username, usuario.username); // Verificamos que el nombre de usuario sea correcto

				// Ahora comprobamos que la contraseña proporcionada por el usuario sea correcta
				const validPassword = await bcrypt.compare(usuario.password, result.password); // Comparar con la contraseña en texto plano
				assert.ok(validPassword); // Debería ser `true` si la contraseña es correcta
			}
			catch (err) {
				console.log(err);
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
