/* eslint-disable no-undef */

const assert = require("assert");
const { deleteRecipes, deleteIngredients, deleteContains, insertIngredients, insertRecetas, insertContains } = require("../testUtils");
const Contains = require("../../models/containsModel");

describe("Contains test", () => {
	before(async () => {
		await deleteContains();
		await deleteRecipes();
		await deleteIngredients();
	});

	describe("Obtener ingredientes de una receta", () => {
		const ingredients = [
			[ "harina", "kilogramos" ],
			[ "sal", "gramos" ],
			[ "agua", "litros" ]
		];

		const recipe = [ [ "pan", "harina, agua y sal" ] ];

		let contains;

		let ingredientsIds;
		let recipeId;
		before(async () => {
			ingredientsIds = await insertIngredients(ingredients).then(ings => ings.map(({ id }) => id));
			[ recipeId ] = await insertRecetas(recipe).then(recp => recp.map(({ id }) => id));
			contains = ingredientsIds.map(id => [ recipeId, id, 10 ]);

			await insertContains(contains);
		});

		it("Debe devolver los ingredientes de una receta existente", async () => {
			const recipeIngredients = await Contains.getIngredientsFromRecipe(recipeId);
			assert.equal(recipeIngredients.length, ingredients.length);

			const ingredientSet = new Set(recipeIngredients.map(({ nombre }) => nombre));

			let ok = true;

			ingredients.forEach(([ name ]) => {
				if (!ingredientSet.has(name)) ok = false;
			});

			assert.ok(ok);
		});

		it("No debe devolver los ingredientes de una receta inexistente", async () => {
			const recipeIngredients = await Contains.getIngredientsFromRecipe(-1);
			assert.ok(!recipeIngredients.length);
		});

		after(async () => {
			await deleteContains();
			await deleteIngredients();
			await deleteRecipes();
		});
	});
});
