// /* eslint-disable no-undef */

// Const assert = require("assert");
// Const { deleteUsers } = require("./testUtils");
// Const User = require("../models/userModel");

// Describe("Servicio usuario", () => {
// 	Describe("Inicio de sesion", () => {
// 		// Before(testtingSession);
// 		Before(deleteUsers);
// 		After(deleteUsers);

// 		It("✅ Inicio de sesión con credenciales válidas", async () => {
// 			Const usuario = {
// 				Username: "user1",
// 				Password: "12345678"
// 			};

// 			Let good = true;

// 			Try {
// 				Const result = await User.inicio(usuario);
// 				Assert.ok(result);
// 				Assert.equal(result.username, usuario.username); // Verificamos que el nombre de usuario sea correcto
// 			}
// 			Catch (err) {
// 				Good = false;
// 			}

// 			Assert.ok(good);
// 		});

// 		It("❌ No debe iniciar sesión con contraseña incorrecta", async () => {
// 			Const usuario = {
// 				Username: "user1",
// 				Password: "123456789"
// 			};

// 			Good = false;
// 			Try {
// 				Await User.inicio(usuario);
// 			}
// 			Catch (error) {
// 				Good = true;
// 			}

// 			Assert.ok(good);
// 		});

// 		It("❌ No debe iniciar sesión con nombre incorrecto", async () => {
// 			Const usuario = {
// 				Username: "nombre_incorrecto",
// 				Password: "12345678"
// 			};

// 			Good = false;
// 			Try {
// 				Await User.inicio(usuario);
// 			}
// 			Catch (error) {
// 				Good = true;
// 			}

// 			Assert.ok(good);
// 		});

// 		It("❌ No debe iniciar sesión sin nombre", async () => {
// 			Const usuario = { password: "12345678" };

// 			Good = false;
// 			Try {
// 				Await User.inicio(usuario);
// 			}
// 			Catch (error) {
// 				Good = true;
// 			}

// 			Assert.ok(good);
// 		});

// 		It("❌ No debe iniciar sesión sin contraseña", async () => {
// 			Const usuario = { username: "user1" };

// 			Good = false;
// 			Try {
// 				Await User.inicio(usuario);
// 			}
// 			Catch (error) {
// 				Good = true;
// 			}

// 			Assert.ok(good);
// 		});

// 	});
// });
