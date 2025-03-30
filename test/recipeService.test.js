/* eslint-disable no-undef */
/* eslint-disable no-magic-numbers */
const assert = require("assert");
const Recipe = require("../services/recipeService");
const { deleteIngredients, insertIngredients, insertPantry, deletePantry, deleteUsers, insertRecetas, deleteRecipes, insertContains, deleteContains } = require("./testUtils");
const User = require("../models/userModel");
const db = require("../config/database");
const CERO = 0;
const QUINIENTOS = 500;

describe("Servicio de recetas", () => {
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
		const ids = ings.map(ing => ing.id);

		const pantrys = [
			[ user.id, ids[0], QUINIENTOS ],
			[ user.id, ids[1], QUINIENTOS ],
			[ user.id, ids[2], QUINIENTOS ],
			[ user.id, ids[3], QUINIENTOS ],
			[ user2.id, ids[0], QUINIENTOS ]
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

	describe("Obtener todas las recetas", () => {

		it("Debe devolver un array con todas las recetas", async () => {
			const recipes = await Recipe.getAllRecipes();
			assert.ok(Array.isArray(recipes));
		});
	});

	describe("Obtener recetas recomendadas", () => {

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
		});

		it("Debe devolver un array vacío si no hay recetas recomendadas", async () => {
			const recommendations = await Recipe.getRecommendations({ id: user0.id });
			assert.deepEqual(recommendations, []);
		});
	});

	describe("Obtener los datos de una receta por su id", () => {
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

	  	const recipe = [ [ "Nombre", "Descripcion" ] ];

		it("Debe devolver la receta correcta segun su id", async () => {
			const ids = await insertRecetas(recipe);
			const result = await Recipe.getRecipeById(ids[0].id);

			assert.deepEqual([ [ result.nombre, result.descripcion ] ], recipe);
		});

		it("No debe devolver una receta por falta de id", async () => {
			try {
				await Recipe.getRecipeById();

				assert.fail("Se esperaba un error");
			}
			catch (error) {
				assert.strictEqual(error.message, "No hay id");
			}
		});

		it("No debe devolver una receta que no econtrada", async () => {
			try {
				const errorId = -1;

			    await insertRecetas(recipe);
			    await Recipe.getRecipeById(errorId);

				assert.fail("Se esperaba un error");
			}
			catch (error) {
				assert.strictEqual(error.message, "Receta no encontrada");
			}
		});
	});

	describe("Obtener los ingredientes de una receta por su id", () => {
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

		const recipe = [ [ "Nombre", "Descripcion" ] ];
		const ingredients = [
			[ "Ingrediente1", "TipoUnidad1" ],
			[ "Ingrediente2", "TipoUnidad2" ]
		];

		it("Debe devolver los ingredientes correctos de una receta por su id", async () => {

			const recipeIds = await insertRecetas(recipe);
			const ingredientsIds = await insertIngredients(ingredients);
			const contains = [
				[ recipeIds[0].id, ingredientsIds[0].id, 100 ],
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

		it("No debe devolver ingredientes por falta de id", async () => {
			try {
				await Recipe.getIngredients();
				assert.fail("Se esperaba un error");
			}
			catch (error) {
				assert.strictEqual(error.message, "No hay id");
			}
		});

		it("No debe devolver ingredientes por receta no encontrada", async () => {
			try {
				const errorId = -1;

				const recipeIds = await insertRecetas(recipe);
				const ingredientsIds = await insertIngredients(ingredients);

				const contains = [
					[ recipeIds[0].id, ingredientsIds[0].id, 100 ],
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
