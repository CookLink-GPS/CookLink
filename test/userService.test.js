/* eslint-disable no-undef */

const assert = require("assert");
const UserService = require("../services/userService"); // Asegúrate de que el path es correcto
const { deleteUsers, testtingSession } = require("./testUtils");

describe("Servicio de usuario", () => {
	// Describe("Inicio de sesión", () => {
	// 	Before(testtingSession);
	// 	After(deleteUsers);

	// 	It("✅ Debe iniciar sesión con credenciales válidas", async () => {
	// 		Const usuario = {
	// 			Username: "user1",
	// 			Password: "12345678"
	// 		};

	// 		Let result;
	// 		Try {
	// 			Result = await UserService.iniciarSesion(usuario);
	// 		}
	// 		Catch (err) {
	// 			Assert.fail("Error en el inicio de sesión");
	// 		}

	// 		Assert.ok(result);
	// 		Assert.equal(result.username, usuario.username); // Verificamos que el nombre de usuario sea correcto
	// 	});

	// 	It("❌ No debe iniciar sesión con contraseña incorrecta", async () => {
	// 		Const usuario = {
	// 			Username: "user1",
	// 			Password: "123456789"
	// 		};

	// 		Let error;
	// 		Try {
	// 			Await UserService.iniciarSesion(usuario);
	// 		}
	// 		Catch (err) {
	// 			Error = err;
	// 		}

	// 		Assert.ok(error);
	// 		Assert.equal(error.message, "Credenciales inválidas");
	// 	});

	// 	It("❌ No debe iniciar sesión con nombre incorrecto", async () => {
	// 		Const usuario = {
	// 			Username: "nombre_incorrecto",
	// 			Password: "12345678"
	// 		};

	// 		Let error;
	// 		Try {
	// 			Await UserService.iniciarSesion(usuario);
	// 		}
	// 		Catch (err) {
	// 			Error = err;
	// 		}

	// 		Assert.ok(error);
	// 		Assert.equal(error.message, "Usuario no encontrado");
	// 	});

	// 	It("❌ No debe iniciar sesión sin nombre de usuario", async () => {
	// 		Const usuario = { password: "12345678" };

	// 		Let error;
	// 		Try {
	// 			Await UserService.iniciarSesion(usuario);
	// 		}
	// 		Catch (err) {
	// 			Error = err;
	// 		}

	// 		Assert.ok(error);
	// 		Assert.equal(error.message, "Falta el nombre de usuario");
	// 	});

	// 	It("❌ No debe iniciar sesión sin contraseña", async () => {
	// 		Const usuario = { username: "user1" };

	// 		Let error;
	// 		Try {
	// 			Await UserService.iniciarSesion(usuario);
	// 		}
	// 		Catch (err) {
	// 			Error = err;
	// 		}

	// 		Assert.ok(error);
	// 		Assert.equal(error.message, "Falta la contraseña");
	// 	});

	// 	It("❌ No debe iniciar sesión con una contraseña vacía", async () => {
	// 		Const usuario = {
	// 			Username: "user1",
	// 			Password: ""
	// 		};

	// 		Let error;
	// 		Try {
	// 			Await UserService.iniciarSesion(usuario);
	// 		}
	// 		Catch (err) {
	// 			Error = err;
	// 		}

	// 		Assert.ok(error);
	// 		Assert.equal(error.message, "Falta la contraseña");
	// 	});

	// 	It("❌ No debe iniciar sesión si el usuario no existe en la base de datos", async () => {
	// 		Const usuario = {
	// 			Username: "usuario_no_existente",
	// 			Password: "12345678"
	// 		};

	// 		Let error;
	// 		Try {
	// 			Await UserService.iniciarSesion(usuario);
	// 		}
	// 		Catch (err) {
	// 			Error = err;
	// 		}

	// 		Assert.ok(error);
	// 		Assert.equal(error.message, "Usuario no encontrado");
	// 	});
	// });
});
