/* eslint-disable no-undef */

const assert = require("assert");
const Recipe = require("../services/recipeService");
// Const { badRequest, ok, conflict } = require("../config/httpcodes");

describe("Servicio de recetas", () => {

	describe("Obtener todas las recetas", () => {

		it("Debe devolver un array con todas las recetas", async () => {
			const recipes = await Recipe.getAllRecipes();

			assert.ok(Array.isArray(recipes));
		});

		// It("Debe devolver un array vacío si no hay recetas", async () => {
		// 	Const recipes = await Recipe.getAllRecipes();

		// 	Assert.deepEqual(recipes, []);
		// });
	});

	describe("Obtener recetas recomendadas", () => {

		it("Debe devolver una lista de recetas recomendadas", async () => {
			const recommendations = await Recipe.getRecommendations({ id: 1 });

			assert.ok(Array.isArray(recommendations));
		});

		it("Debe devolver un array vacío si no hay recetas recomendadas", async () => {
			const recommendations = await Recipe.getRecommendations({ id: 1 });

			assert.deepEqual(recommendations, []);
		});
	});
});
