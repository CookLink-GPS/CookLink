/* eslint-disable no-undef */

const assert = require("assert");
const Recipe = require("../models/recipeModel");

describe("Modelo receta", () => {

	describe("Obtener recetas", () => {

		it("Debe devolver un array con todas las recetas", async () => {
			const recipes = await Recipe.getAllRecipes();
			assert.ok(Array.isArray(recipes));
		});
	});
});
