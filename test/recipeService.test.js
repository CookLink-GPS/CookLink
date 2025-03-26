/* eslint-disable no-undef */

const assert = require("assert");
const Recipe = require("../services/recipeService");
const { deleteUsers } = require("./testUtils");
const User = require("../models/userModel");
const db = require("../config/database");
const CERO = 0;
const UNO =1;
const DOS = 2;
const TRES = 3;
const CUATRO = 4;
const CINCO = 5;
const SEIS = 6;
const SIETE = 7;
const OCHO = 8;
const QUINIENTOS = 500;

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
		let user, user2, user0;

		before(async () => {
			// Crear usuarios con diferentes niveles de ingredientes en la despensa
			await db.query("INSERT INTO usuarios (id, username, password) VALUES ('Luis', '123456789')");
			user = User.getByUsername("Luis");
			console.log(user);

			await db.query("INSERT INTO usuarios (id, username, password) VALUES ('Paula', '123456789')");
			user2 = User.getByUsername("Paula");

			await db.query("INSERT INTO usuarios (id, username, password) VALUES ('Alberto', '123456789')");
			user0 = User.getByUsername("Alberto");

			// Asignar ingredientes a cada usuario
			await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?, ?)", [ user.id, UNO, QUINIENTOS ]);
			await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?, ?)", [ user.id, DOS, QUINIENTOS ]);
			await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?, ?)", [ user.id, TRES, QUINIENTOS ]);
			await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?, ?)", [ user.id, CUATRO, QUINIENTOS ]);
			await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?, ?)", [ user.id, CINCO, QUINIENTOS ]);

			await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?, ?)", [ user.id, SEIS, QUINIENTOS ]);
			await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?, ?)", [ user.id, SIETE, QUINIENTOS ]);
			await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?, ?)", [ user.id, OCHO, QUINIENTOS ]);

		});

		after(async () => {
			await db.query("DELETE FROM despensa WHERE id_usuario IN (?, ?, ?)", [ user.id, user2.id, user0.id ]);
			await db.query("DELETE FROM usuarios WHERE id IN (?, ?, ?)", [ user.id, user2.id, user0.id ]);
		});

		it("Debe devolver una lista vacía para un usuario con el 0% de los ingredientes", async () => {
			const recommendations = await Recipe.getRecommendations({ id: user0.id });
			assert.deepEqual(recommendations, []);
		});

		it("Debe devolver una lista de recetas recomendadas para un usuario con el 50% de los ingredientes", async () => {
			const recommendations = await Recipe.getRecommendations({ id: user2.id });
			assert.ok(Array.isArray(recommendations));
			assert.ok(recommendations.length > CERO);
		});

		it("Debe devolver una lista de recetas recomendadas para un usuario con el 100% de los ingredientes", async () => {
			const recommendations = await Recipe.getRecommendations({ id: user.id });
			assert.ok(Array.isArray(recommendations));
			assert.ok(recommendations.length > CERO);
			console.log(recommendations.length);
		});

		it("Debe devolver un array vacío si no hay recetas recomendadas", async () => {
			const recommendations = await Recipe.getRecommendations({ id: user0.id });
			assert.deepEqual(recommendations, []);
		});
	});
});
