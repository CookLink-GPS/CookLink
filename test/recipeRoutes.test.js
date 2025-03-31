/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */

const assert = require("assert");
const { deleteIngredients, insertIngredients, deleteRecipes, insertRecetas, deleteContains, insertContains } = require("./testUtils");
const { baseUrl, port } = require("../config/config");
const { ok } = require("../config/httpcodes");
this.timeout(5000);

describe("Rutas de recetas", () => {

	beforeEach(async () => {
		await deleteContains();
		await deleteIngredients();
		await deleteRecipes();
	  });

	  after(async () => {
		await deleteContains();
		await deleteIngredients();
		await deleteRecipes();
	  });

	const baseRoute = `http://${baseUrl}:${port}/recipes/`;

	describe("Obtener recetas recomendadas", () => {
		const route = `${baseRoute}recommended`;

		it("Redirige correctamente", async () => { // TODO obtener lista recetas y comprobar que son iguales
			const res = await fetch(route);

			assert.equal(res.status, ok); // 200 éxito
		});
	});

	describe("Obtener la informacion de una receta", () => {

		const recipe = [ [ "Nombre", "Descripcion" ] ];
		const ingredients = [
			[ "Ingrediente1", "TipoUnidad1" ],
			[ "Ingrediente2", "TipoUnidad2" ]
		];

		it("Redirige correctamente", async () => {
			const recipeIds = await insertRecetas(recipe);
			const ingredientsIds = await insertIngredients(ingredients);
			const contains = [
				[ recipeIds[0].id, ingredientsIds[0].id, 100 ],
				[ recipeIds[0].id, ingredientsIds[1].id, 200 ]
			];
			await insertContains(contains);

			const route = `${baseRoute}${recipeIds[0].id}`;
			const res = await fetch(route);

			assert.equal(res.status, ok); // 200 éxito
		});
	});
});
