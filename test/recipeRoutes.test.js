/* eslint-disable no-undef */

const assert = require("assert");
const { deleteIngredients, insertIngredients, deleteRecipe, insertRecipes, deleteContains, insertContains } = require("./testUtils");
const { baseUrl, port } = require("../config/config");
const { ok } = require("../config/httpcodes");

describe("Rutas de recetas", () => {

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

	const baseRoute = `http://${baseUrl}:${port}/recipes/`;

	describe("Obtener la informacion de una receta", () => {

		const recipe = [ [ "Nombre", "Descripcion" ] ];
		const ingredients = [
			[ "Ingrediente1", "TipoUnidad1" ],
			[ "Ingrediente2", "TipoUnidad2" ]
		];

		it("Redirige correctamente", async () => {
			const recipeIds = await insertRecipes(recipe);
			const ingredientsIds = await insertIngredients(ingredients);
			const contains = [
				// eslint-disable-next-line no-magic-numbers
				[ recipeIds[0].id, ingredientsIds[0].id, 100 ],
				// eslint-disable-next-line no-magic-numbers
				[ recipeIds[0].id, ingredientsIds[1].id, 200 ]
			];
			await insertContains(contains);

			const route = `${baseRoute}${recipeIds[0].id}`;
			const res = await fetch(route);

			assert.equal(res.status, ok); // 200 éxito
		});

	});
});
