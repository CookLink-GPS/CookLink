/* eslint-disable no-undef */

const assert = require("assert");
const Recipe = require("../../services/recipeService");
const { deleteIngredients, insertIngredients, insertPantry, deletePantry, deleteUsers, insertRecetas, deleteRecipes, insertContains, deleteContains, insertListaCompra, deleteListaCompra } = require("../testUtils");
const User = require("../../models/userModel");
const db = require("../../config/database");
const CERO = 0;
const QUINIENTOS = 500;
const SETECIENTOS = 700;
const TRESCIENTOS = 300;
const DOSCIENTOS = 200;


describe("Servicio de recetas", () => {
	let user, user2, user0;
	let ids, idrs;

	beforeEach(async () => {

		await deleteListaCompra();
		await deleteUsers();
		await deleteIngredients();
		await deletePantry();
		await deleteRecipes();
		await deleteContains();

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
			[ "chocolate", "gramos" ]
		];
		const ings = await insertIngredients(ingredientes);
		ids = ings.map(ing => ing.id);

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
			[ "receta2", "descripcion2" ],
			[ "receta3", "descripcion3" ],
			[ "receta4", "descripcion4" ],
			[ "receta5", "descripcion5" ]
		];
		const rects = await insertRecetas(recetas);

		idrs = rects.map(rec => rec.id);

		// Receta, ingrediente, cantidad
		const contienen = [
			[ idrs[0], ids[0], QUINIENTOS ],
			[ idrs[0], ids[1], QUINIENTOS ],
			[ idrs[0], ids[2], QUINIENTOS ],
			[ idrs[0], ids[3], QUINIENTOS ],
			[ idrs[1], ids[0], QUINIENTOS ],
			[ idrs[1], ids[1], QUINIENTOS ],
			[ idrs[2], ids[1], SETECIENTOS ],
			[ idrs[3], ids[0], DOSCIENTOS ],
			[ idrs[4], ids[0], QUINIENTOS ]
		];
		await insertContains(contienen);

		const ingLista = [ [ user.id, ids[1], TRESCIENTOS, "gramos" ] ];
		await insertListaCompra(ingLista);

	});

	after(async () => {
		await deleteListaCompra();
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

		it("Debe devolver la receta correcta segun su id", async () => {
			const result = await Recipe.getRecipeById(idrs[0]);
			assert.deepEqual([ result.nombre, result.descripcion ], [ "receta1", "descripcion1" ]);
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
			    await Recipe.getRecipeById(errorId);
				assert.fail("Se esperaba un error");
			}
			catch (error) {
				assert.strictEqual(error.message, "Receta no encontrada");
			}
		});
	});

	describe("Obtener los ingredientes de una receta por su id", () => {

		it("Debe devolver los ingredientes correctos de una receta por su id", async () => {

			const result = await Recipe.getIngredients(idrs[1]);
			assert.deepEqual(
				result,
				[
					{ ingrediente: "harina", tipoUnidad: "gramos", unidades: QUINIENTOS },
					{ ingrediente: "arroz", tipoUnidad: "gramos", unidades: QUINIENTOS }
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
			    await Recipe.getIngredients(errorId);
				assert.fail("Se esperaba un error");
			}
			catch (error) {
				assert.strictEqual(error.message, "No hay ingredientes");
			}
		});
	});

	describe("Comprobar requisitos de la receta", () => {

		it("Debe de devolver que todos los ingredientes son suficientes ", async () => {

			const result = await Recipe.checkRecipeRequirements(user.id, idrs[1]);

			assert.deepStrictEqual(result, {
				suficientes: [
					{ id: ids[0], nombre: "harina", unidades: QUINIENTOS, tipoUnidad: "gramos" },
					{ id: ids[1], nombre: "arroz", unidades: QUINIENTOS, tipoUnidad: "gramos" }
				],
					  faltantes: []
			});

		});

		it("Debe de devolver que todos los ingredientes son faltantes ", async () => {

			const result = await Recipe.checkRecipeRequirements(user0.id, idrs[1]);

			assert.deepStrictEqual(result, {
				suficientes: [],
				faltantes: [
					{ id: ids[0], nombre: "harina", unidadesNecesarias: QUINIENTOS, tipoUnidad: "gramos" },
					{ id: ids[1], nombre: "arroz", unidadesNecesarias: QUINIENTOS, tipoUnidad: "gramos" }
				]
			});

		});

		it("Debe de devolver ingredientes que sean suficientes y faltantes ", async () => {

			const result = await Recipe.checkRecipeRequirements(user2.id, idrs[1]);

			assert.deepStrictEqual(result, {
				suficientes: [ { id: ids[0], nombre: "harina", unidades: QUINIENTOS, tipoUnidad: "gramos" } ],
				faltantes: [ { id: ids[1], nombre: "arroz", unidadesNecesarias: QUINIENTOS, tipoUnidad: "gramos" } ]
			});

		});

		it("Debe de calcular bien las unidades necesarias ", async () => {

			const result = await Recipe.checkRecipeRequirements(user.id, idrs[2]);

			assert.deepStrictEqual(result, {
				suficientes: [],
				faltantes: [ { id: ids[1], nombre: "arroz", unidadesNecesarias: DOSCIENTOS, tipoUnidad: "gramos" } ]
			});

		});
	});

	describe("Cocinar receta", () => {

		it("Debe disminuir correctamente en la despensa los ingredientes de la receta", async () => {

			const requirements = await Recipe.checkRecipeRequirements(user.id, idrs[3]);
			const result = await Recipe.cookRecipe({
				userId: user.id,
				recipeId: idrs[3],
				suficientes: requirements.suficientes
			});

			const cantidadPantry = await db.query("SELECT cantidad  FROM despensa WHERE id_usuario = ? AND id_ingrediente = ?", [ user.id, ids[0] ]);

			assert.strictEqual(result.success, true);
			assert.strictEqual(result.message, "¡Receta cocinada con éxito!");
			assert.deepStrictEqual(result.usados, requirements.suficientes);
			assert.deepStrictEqual(cantidadPantry[0].cantidad, TRESCIENTOS);

		});

		it("Debe eliminar los ingredientes cuando se cocina toda su cantidad", async () => {

			const requirements = await Recipe.checkRecipeRequirements(user.id, idrs[4]);
			const result = await Recipe.cookRecipe({
				userId: user.id,
				recipeId: idrs[4],
				suficientes: requirements.suficientes
			});

			const cantidadPantry = await db.query("SELECT cantidad  FROM despensa WHERE id_usuario = ? AND id_ingrediente = ?", [ user.id, ids[0] ]);

			assert.strictEqual(result.success, true);
			assert.strictEqual(result.message, "¡Receta cocinada con éxito!");
			assert.deepStrictEqual(result.usados, requirements.suficientes);
			assert.deepStrictEqual( cantidadPantry, []);
		});
	});

	describe(" Añadir ingredientes que faltan a la lista de la compra", () => {

		it("Debe de insertar un ingrediente nuevo en la lista", async () => {
			const requirements = await Recipe.checkRecipeRequirements(user0.id, idrs[2]);
			const result = await Recipe.addMissingToShoppingList(user0.id, idrs[2], requirements.faltantes);
			const cantidadLista= await db.query( "SELECT cantidad FROM lista_compra WHERE id_usuario = ? AND id_ingrediente = ?", [ user0.id, ids[1] ]);

			assert.strictEqual(result.success, true);
			assert.strictEqual(result.message, "Ingredientes añadidos a tu lista de la compra");
			assert.deepStrictEqual(result.faltantes, requirements.faltantes);
			assert.deepStrictEqual( cantidadLista[0].cantidad, SETECIENTOS );
		});

		it("Debe de aumentar la cantidad de un ingrediente de la lista", async () => {
			const requirements = await Recipe.checkRecipeRequirements(user.id, idrs[2]);
			const result = await Recipe.addMissingToShoppingList(user.id, idrs[2], requirements.faltantes);
			const cantidadLista= await db.query( "SELECT cantidad FROM lista_compra WHERE id_usuario = ? AND id_ingrediente = ?", [ user.id, ids[1] ]);

			assert.strictEqual(result.success, true);
			assert.strictEqual(result.message, "Ingredientes añadidos a tu lista de la compra");
			assert.deepStrictEqual(result.faltantes, requirements.faltantes);
			assert.deepStrictEqual( cantidadLista[0].cantidad, QUINIENTOS );
		});
	});

});
