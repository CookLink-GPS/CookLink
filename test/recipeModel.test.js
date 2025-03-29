/* eslint-disable no-undef */

const assert = require("node:assert");
const { deleteIngredients, insertIngredients, deleteRecipe, insertRecipes, deleteContains, insertContains } = require("./testUtils");
const Recipe = require("../models/recipeModel");

describe("Modelo Receta", () => {

	beforeEach(async () => {
		await deleteIngredients();
		await deleteRecipe();
		await deleteContains();
	  });

	  after(async () => {
		await deleteIngredients();
		await deleteRecipe();
		await deleteContains();
	  });

	describe("Obtener recetas", () => {

		it("Debe devolver un array con todas las recetas", async () => {
			const recipes = await Recipe.getAllRecipes();
			assert.ok(Array.isArray(recipes));
		});
	});

	describe("Obtener los datos de una receta por su id", () => {

		it("Debe de devolver la receta correcta segun su id", async () => {
			const recipe = [ [ "Nombre", "Descripcion" ] ];

			const ids = await insertRecipes(recipe);
			const result = await Recipe.getRecipeById(ids[0].id);

			assert.deepEqual([ [ result.nombre, result.descripcion ] ], recipe);
		});

	});

	describe("Obtener los ingredientes de una receta por su id", () => {

		it("Debe de devolver los ingredientes correctos de una receta por su id", async () => {
			const recipe = [ [ "Nombre", "Descripcion" ] ];
			const recipeIds = await insertRecipes(recipe);

			const ingredients = [
				[ "Ingrediente1", "TipoUnidad1" ],
				[ "Ingrediente2", "TipoUnidad2" ]
			];
			const ingredientsIds = await insertIngredients(ingredients);

			const contains = [
				// eslint-disable-next-line no-magic-numbers
				[ recipeIds[0].id, ingredientsIds[0].id, 100 ],
				// eslint-disable-next-line no-magic-numbers
				[ recipeIds[0].id, ingredientsIds[1].id, 200 ]
			];
			await insertContains(contains);

			const result = await Recipe.getIngredients(recipeIds[0].id);

			assert.deepEqual(
				result,
				[
					{ ingrediente: ingredientsIds[0].nombre, tipoUnidad: ingredientsIds[0].tipoUnidad, unidades: contains[0][2] },
					{ ingrediente: ingredientsIds[1].nombre, tipoUnidad: ingredientsIds[1].tipoUnidad, unidades: contains[1][2] }
				]
			);
		});

	});
});
