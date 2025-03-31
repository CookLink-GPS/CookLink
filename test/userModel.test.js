/* eslint-disable no-undef */

const assert = require("assert");
const { deleteUsers } = require("./testUtils");
const User = require("../models/userModel");

describe("Modelo usuario", () => {
	before(deleteUsers); // Antes de todos los test
	beforeEach(deleteUsers); // Despues de cada test

	describe("Registro", () => {


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
				good = true;
			}

			assert.ok(good);
		});
	});
});
