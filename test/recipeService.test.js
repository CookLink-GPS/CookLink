/* eslint-disable no-undef */

const assert = require("assert");
const Recipe = require("../services/recipeService");
const { deleteIngredients, insertIngredients, insertPantry, deletePantry, deleteUsers, insertRecetas, deleteRecipes, insertContains, deleteContains } = require("./testUtils");
const User = require("../models/userModel");
const db = require("../config/database");
const CERO = 0;
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
			await db.query("INSERT INTO usuarios (username, password) VALUES ('Luis', '123456789')");
			user = await User.getByUsername("Luis");

			await db.query("INSERT INTO usuarios (username, password) VALUES ('Paula', '123456789')");
			user2 = await User.getByUsername("Paula");

			await db.query("INSERT INTO usuarios (username, password) VALUES ('Alberto', '123456789')");
			user0 = await User.getByUsername("Alberto");

			const ingredientes = [
				[ "harina", "gramos" ],
				[ "arroz", "gramos" ],
				[ "leche", "litros" ],
				[ "harina de avena", "gramos" ]
			];
			const ings = await insertIngredients(ingredientes);
			console.log(ings);
			const ids = ings.map(ing => ing.id);

			const pantrys = [
				[ user.id, ids[0], QUINIENTOS ],
				[ user.id, ids[1], QUINIENTOS ],
				[ user.id, ids[2], QUINIENTOS ],
				[ user.id, ids[3], QUINIENTOS ],
				[ user2.id, ids[0], QUINIENTOS ],
				[ user2.id, ids[1], QUINIENTOS ]
			];
			await insertPantry(pantrys);

			const recetas = [
				[ "receta1", "descripcion1" ],
				[ "receta2", "descripcion2" ]
			];
			const rects = await insertRecetas(recetas);

			const idrs = rects.map(rec => rec.id);

			// Receta, ingrediente, cantidad
			const contienen = [
				[ idrs[0], ids[0], QUINIENTOS ],
				[ idrs[0], ids[1], QUINIENTOS ],
				[ idrs[0], ids[2], QUINIENTOS ],
				[ idrs[0], ids[3], QUINIENTOS ],
				[ idrs[1], ids[0], QUINIENTOS ],
				[ idrs[1], ids[1], QUINIENTOS ]
			];
			await insertContains(contienen);

		});

		after(async () => {
			await deleteUsers();
			await deleteIngredients();
			await deletePantry();
			await deleteRecipes();
			await deleteContains();
		});

		it("Debe devolver una lista vacía para un usuario con el 0% de los ingredientes", async () => {
			const recommendations = await Recipe.getRecommendations({ id: user0.id });
			assert.deepEqual(recommendations, []);
		});

		it("Debe devolver una lista de recetas recomendadas para un usuario con el 50% de los ingredientes", async () => {
			const recommendations = await Recipe.getRecommendations({ id: user2.id });
			console.log(recommendations);
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
