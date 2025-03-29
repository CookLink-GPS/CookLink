/* eslint-disable no-undef */
const assert = require("node:assert");
const { deleteIngredients, insertIngredients, deleteRecipe, insertRecipes, deleteContains, insertContains } = require("./testUtils");
const Recipe = require("../services/recipeService");


describe("Servicio de recetas", () => {

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

	describe("Obtener los datos de una receta por su id", () => {

		const recipe = [ [ "Nombre", "Descripcion" ] ];

		it("Debe de devolver la receta correcta segun su id", async () => {

			const ids = await insertRecipes(recipe);
			const result = await Recipe.getRecipeById(ids[0].id);

			assert.deepEqual([ [ result.nombre, result.descripcion ] ], recipe);
		});

		it("No debe de devolver una receta por falta de id", async () => {
			try {
				await Recipe.getRecipeById();

				assert.fail("Se esperaba un error");
			}
			catch (error) {
				assert.strictEqual(error.message, "No hay id");
			}
		});

		it("No debe de devolver una receta que no econtrada", async () => {
			try {
				const errorId = -1;

			    await insertRecipes(recipe);
			    await Recipe.getRecipeById(errorId);

				assert.fail("Se esperaba un error");
			}
			catch (error) {
				assert.strictEqual(error.message, "Receta no encontrada");
			}
		});
	});

	describe("Obtener los ingredientes de una receta por su id", () => {

		const recipe = [ [ "Nombre", "Descripcion" ] ];
		const ingredients = [
			[ "Ingrediente1", "TipoUnidad1" ],
			[ "Ingrediente2", "TipoUnidad2" ]
		];

		it("Debe de devolver los ingredientes correctos de una receta por su id", async () => {

			const recipeIds = await insertRecipes(recipe);
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

		it("No debe de devolver ingredientes por falta de id", async () => {
			try {
				await Recipe.getIngredients();
				assert.fail("Se esperaba un error");
			}
			catch (error) {
				assert.strictEqual(error.message, "No hay id");
			}
		});

		it("No debe de devolver ingredientes por receta no encontrada", async () => {
			try {
				const errorId = -1;

				const recipeIds = await insertRecipes(recipe);
				const ingredientsIds = await insertIngredients(ingredients);

				const contains = [
				// eslint-disable-next-line no-magic-numbers
					[ recipeIds[0].id, ingredientsIds[0].id, 100 ],
					// eslint-disable-next-line no-magic-numbers
					[ recipeIds[0].id, ingredientsIds[1].id, 200 ]
				];
				await insertContains(contains);

			    await Recipe.getIngredients(errorId);
				assert.fail("Se esperaba un error");
			}
			catch (error) {
				assert.strictEqual(error.message, "No hay ingredientes");
			}
		});

	});
});
