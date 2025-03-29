/* eslint-disable no-undef */
const assert = require("node:assert");
const Recipe = require("../services/recipeService");
const { deleteRecipe, insertRecipes } = require("./testUtils");

describe("Servicio de recetas", () => {

	beforeEach(deleteRecipe);
	after(deleteRecipe);

	describe("Obtener los datos de una receta por su id", () => {
		it("Debe de devolver la receta correcta segun su id", async () => {
			const recipe = [ [ "Nombre", "Descripcion" ] ];

			const ids = await insertRecipes(recipe);
			const result = await Recipe.getRecipeById(ids[0].id);

			assert.deepEqual([ [ result.nombre, result.descripcion ] ], recipe);
		});

		it("Debe de dar el error de que no hay id", async () => {
			try {
				await Recipe.getRecipeById();
				assert.fail("Se esperaba un error");
			}
			catch (error) {
				assert.strictEqual(error.message, "No hay id");
			}
		});

		it("Debe de dar el error de receta no econtrada", async () => {
			try {
				const errorId = -1;
				const recipe = [ [ "Nombre", "Descripcion" ] ];

			    await insertRecipes(recipe);
			    await Recipe.getRecipeById(errorId);
				assert.fail("Se esperaba un error");
			}
			catch (error) {
				assert.strictEqual(error.message, "Receta no encontrada");
			}
		});
	});
});
