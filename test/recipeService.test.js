/* eslint-disable no-undef */

const assert = require("assert");
const Recipe = require("../services/recipeService");
const { deleteUsers } = require("./testUtils");
const User = require("../models/userModel");
const db = require("../config/database");
const CERO = 0;
// Const RecipeModel = require("../models/recipeModel");
// Const { badRequest, ok, conflict } = require("../config/httpcodes");

describe("Servicio de recetas", () => {

	describe("Obtener todas las recetas", () => {

		it("Debe devolver un array con todas las recetas", async () => {
			const recipes = await Recipe.getAllRecipes();

			assert.ok(Array.isArray(recipes));
		});
	});

	describe("Obtener recetas recomendadas", () => {
		/* METER:
		METIENDO UN USUARIO QUE NO TENGA DESPENSA LLENA Y NO LE SALGA NADA

		QUE EL USUARIO TENGA EL 50% DE INGREDIENTES DE UNA RECETA Y LE SALGA

		QUE EL USUARIO TENGA EL 100% DE INGREDIENTES DE UNA RECETA Y LE SALGA
		*/
		// Let user, user2, user0;

		// Before(async () => {
		// 	// Crear usuarios con diferentes niveles de ingredientes en la despensa
		// 	Const userResult = await db.query("INSERT INTO usuarios (username, password) VALUES ('Luis', '123456789')");
		// 	User = { id: userResult.insertId };

		// 	Const user2Result = await db.query("INSERT INTO usuarios (username, password) VALUES ('Paula', '123456789')");
		// 	User2 = { id: user2Result.insertId };

		// 	Const user0Result = await db.query("INSERT INTO usuarios (username, password) VALUES ('Alberto', '123456789')");
		// 	User0 = { id: user0Result.insertId };

		// 	// Crear ingredientes
		// 	Const unoResult = await db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES ('uno', 'unidad')");
		// 	Const uno = { id: unoResult.insertId };

		// 	Const dosResult = await db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES ('dos', 'gramos')");
		// 	Const dos = { id: dosResult.insertId };

		// 	Const tresResult = await db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES ('tres', 'gramos')");
		// 	Const tres = { id: tresResult.insertId };

		// 	// Asignar ingredientes a cada usuario
		// 	Await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, 1)", [ user, uno ]);
		// 	Await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, 100)", [ user, dos ]);
		// 	Await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, 200)", [ user, tres ]);

		// 	Await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, 1)", [ user2, uno ]);

		// 	// Crear receta
		// 	Const recetaResult = await db.query("INSERT INTO recetas (nombre, descripcion) VALUES ('receta1', 'descripcion1')");
		// 	Const receta = { id: recetaResult.insertId };

		// 	// Asignar ingredientes a la receta
		// 	Await db.query("INSERT INTO contiene (id_receta, id_ingrediente, unidades) VALUES (?, ?, 1)", [ receta, uno ]);
		// 	Await db.query("INSERT INTO contiene (id_receta, id_ingrediente, unidades) VALUES (?, ?, 100)", [ receta, dos ]);
		// 	Await db.query("INSERT INTO contiene (id_receta, id_ingrediente, unidades) VALUES (?, ?, 200)", [ receta, tres ]);
		// });

		// After(async () => {
		// 	// Limpiar los datos creados
		// 	Await db.query("DELETE FROM contiene WHERE id_receta IN (SELECT id FROM recetas WHERE nombre = 'receta1')");
		// 	Await db.query("DELETE FROM recetas WHERE nombre = 'receta1'");
		// 	Await db.query("DELETE FROM despensa WHERE id_usuario IN (?, ?, ?)", [ user, user2, user0 ]);
		// 	Await db.query("DELETE FROM usuarios WHERE id IN (?, ?, ?)", [ user, user2, user0 ]);
		// 	Await db.query("DELETE FROM ingredientes WHERE nombre IN ('uno', 'dos', 'tres')");
		// });

		it("Debe devolver una lista vacía para un usuario con el 0% de los ingredientes", async () => {
			const recommendations = await Recipe.getRecommendations({ id: 2 });
			assert.deepEqual(recommendations, []);
		});

		it("Debe devolver una lista de recetas recomendadas para un usuario con el 50% de los ingredientes", async () => {
			const recommendations = await Recipe.getRecommendations({ id: 1 });
			assert.ok(Array.isArray(recommendations));
			assert.ok(recommendations.length > CERO);
		});

		it("Debe devolver una lista de recetas recomendadas para un usuario con el 100% de los ingredientes", async () => {
			const recommendations = await Recipe.getRecommendations({ id: 1 });
			assert.ok(Array.isArray(recommendations));
			assert.ok(recommendations.length > CERO);
		});

		it("Debe devolver un array vacío si no hay recetas recomendadas", async () => {
			const recommendations = await Recipe.getRecommendations({ id: 5 });
			assert.deepEqual(recommendations, []);
		});
	});
});
