/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
const assert = require("assert");
const db = require("../../config/database");
const PantryService = require("../../services/pantryService");
const Pantry = require("../../models/pantryModel");
const AppError = require("../../utils/AppError");
const { deletePantry, insertPantry, deleteUsers, insertIngredients, deleteIngredients, insertDummy } = require("../testUtils");

describe("Servicio de Despensa", () => {
	/**
     * Test group for getPantryIngredients functionality
     * @describe Get pantry ingredients
     */
	describe("Obtener ingredientes de despensa", () => {
		let userId;
		beforeEach(async () => {
			await deletePantry();
			await deleteIngredients();
			await deleteUsers();

			// Crear usuario de prueba
			await db.query("INSERT INTO usuarios (username, password) VALUES (?, ?)", [ "test_user", "password123" ]);
			const [ user ] = await db.query("SELECT id FROM usuarios WHERE username = ?", [ "test_user" ]);
			userId = user.id;

			// Crear ingredientes de prueba
			const ingredients = [
				[ "Harina", "kg" ],
				[ "Azúcar", "kg" ],
				[ "Sal", "g" ]
			];
			await insertIngredients(ingredients);

			// Agregar ingredientes a la despensa
			const ingredientes = await db.query("SELECT id FROM ingredientes");
			const pantryItems = ingredientes.map(ing => [ userId, ing.id, 1 ]);
			await insertPantry(pantryItems);
		});
		/**
         * Should return all ingredients for a given user
         */
		it("debería devolver todos los ingredientes de un usuario", async () => {
			const ingredientes = await PantryService.getPantryIngredients(userId);
			assert.ok(Array.isArray(ingredientes));
			assert.strictEqual(ingredientes.length > 0, true);
		});

		/**
         * Should throw error when user ID is missing
         */
		it("debería lanzar error si falta el ID del usuario", async () => {
			try {
				await PantryService.getPantryIngredients();
				assert.fail("Debería haber lanzado un error");
			}
			catch (error) {
				assert.strictEqual(error instanceof AppError, true);
			}
		});

		/**
         * Should handle database query failures
         */
		it("debería lanzar error si falla la consulta a la base de datos", async () => {
			const originalGetPantryFromUser = Pantry.getPantryFromUser;
			Pantry.getPantryFromUser = () => Promise.reject(new Error("Error de DB"));

			try {
				await PantryService.getPantryIngredients(userId);
				assert.fail("Debería haber lanzado un error");
			}
			catch (error) {
				assert.strictEqual(error instanceof AppError, true);
			}
			finally {
				Pantry.getPantryFromUser = originalGetPantryFromUser;
			}
		});
	});

	/**
     * Test group for getIngredientsDetails functionality
     * @describe Get ingredients details
     */
	describe("Obtener detalles de ingredientes", () => {
		beforeEach(async () => {
			await deletePantry();
			await deleteIngredients();
			await deleteUsers();

			// Crear usuario de prueba
			await db.query("INSERT INTO usuarios (username, password) VALUES (?, ?)", [ "test_user", "password123" ]);
			const [ user ] = await db.query("SELECT id FROM usuarios WHERE username = ?", [ "test_user" ]);
			userId = user.id;

			// Crear ingredientes de prueba
			const ingredients = [
				[ "Harina", "kg" ],
				[ "Azúcar", "kg" ],
				[ "Sal", "g" ]
			];
			await insertIngredients(ingredients);

			// Agregar ingredientes a la despensa
			const ingredientes = await db.query("SELECT id FROM ingredientes");
			const pantryItems = ingredientes.map(ing => [ userId, ing.id, 1 ]);
			await insertPantry(pantryItems);
		});
		/**
         * Should return ingredients in alphabetical order
         */

		it("debería devolver ingredientes ordenados alfabéticamente", async () => {
			const mockIngredients = [
				{ nombre: "Azúcar", tipoUnidad: "kg" },
				{ nombre: "Harina", tipoUnidad: "kg" },
				{ nombre: "Sal", tipoUnidad: "g" }
			];

			const result = await PantryService.getIngredientsDetails(userId);
			result.sort((a, b) => a.nombre.localeCompare(b.nombre));

			let f = false;
			mockIngredients.forEach(mock => {
				result.find(ing => {
					if (mock.nombre !== ing.nombre || mock.tipoUnidad !== ing.tipoUnidad) f = true;
				});
			});

			f = mockIngredients.length !== result.length && f;
			assert.ok(!f);
		});

		/**
         * Should return empty array when pantry has no ingredients
         */
		it("debería devolver lista vacía cuando no hay ingredientes", async () => {
			await deleteIngredients();
			const result = await PantryService.getIngredientsDetails(userId);
			const f = result.length !== 0;
			assert.ok(!f, "Debería estar vacía");
		});
	});

	/**
     * Test group for deleteIngredient functionality
     * @describe Delete ingredients
     */
	describe("Eliminar ingredientes", () => {
		let idDespensa, idIngrediente;

		/**
         * Setup for delete tests
         */
		const insertarIngredienteTest = async () => {
			await db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES (?, ?)", [ "Miel", "g" ]);
			const [ ingrediente ] = await db.query("SELECT id FROM ingredientes WHERE nombre = ?", [ "Miel" ]);
			idIngrediente = ingrediente.id;

			await db.query(
				"INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?)",
				[ userId, idIngrediente, 200 ]
			);
			const [ item ] = await db.query("SELECT id_despensa FROM despensa WHERE id_ingrediente = ?", [ idIngrediente ]);
			idDespensa = item.id_despensa;
		};
		beforeEach(async () => {
			await deletePantry();
			await deleteIngredients();
			await deleteUsers();

			// Crear usuario de prueba
			await db.query("INSERT INTO usuarios (username, password) VALUES (?, ?)", [ "test_user", "password123" ]);
			const [ user ] = await db.query("SELECT id FROM usuarios WHERE username = ?", [ "test_user" ]);
			userId = user.id;

			// Crear ingredientes de prueba
			const ingredients = [
				[ "Harina", "kg" ],
				[ "Azúcar", "kg" ],
				[ "Sal", "g" ]
			];
			await insertIngredients(ingredients);

			// Agregar ingredientes a la despensa
			const ingredientes = await db.query("SELECT id FROM ingredientes");
			const pantryItems = ingredientes.map(ing => [ userId, ing.id, 1 ]);
			await insertPantry(pantryItems);
			await insertarIngredienteTest();
		});

		afterEach(async () => {
			await db.query("DELETE FROM despensa WHERE id_usuario = ?", [ userId ]);
			await db.query("DELETE FROM ingredientes WHERE id = ?", [ idIngrediente ]);
		});

		/**
         * Should completely remove an ingredient when full quantity is deleted
         */
		it("debería eliminar completamente un ingrediente cuando la cantidad a eliminar es igual a la existente", async () => {
			const pantryItem = await Pantry.getPantryItemById(idDespensa);
			const cantidadInicial = pantryItem.cantidad;
			const idIng = pantryItem.id_ingrediente;

			await PantryService.deleteIngredient(userId, idDespensa, cantidadInicial);
			const ingredientes = await PantryService.getPantryIngredients(userId);
			const existe = ingredientes.some(ing => ing.id_ingrediente === idIng);

			assert.equal(existe, false, "El ingrediente debería haber sido eliminado completamente");
		});

		/**
         * Should update quantity when partial amount is deleted
         */
		it("debería actualizar la cantidad al eliminar parcialmente", async () => {
			await PantryService.deleteIngredient(userId, idDespensa, 100);

			const ingredientes = await PantryService.getPantryIngredients(userId);
			const item = ingredientes.find(ing => ing.id_ingrediente === idIngrediente);
			assert.strictEqual(item.cantidad, 100, "Cantidad incorrecta");
		});

		/**
         * Should prevent deleting more quantity than available
         */
		it("debería lanzar error al eliminar más de la cantidad disponible", async () => {
			try {
				await PantryService.deleteIngredient(userId, idDespensa, 201);
				assert.fail("Debería haber fallado");
			}
			catch (error) {
				assert.strictEqual(error instanceof AppError, true);
			}
		});

		/**
		* Should throw an error when the userID is missing
		*/
		it("debería lanzar error si falta el userId", async () => {
			try {
				await PantryService.deleteIngredient(null, idDespensa, 50);
				assert.fail("Debería haber fallado por falta de userId");
			}
			catch (error) {
				assert.strictEqual(error instanceof AppError, true);
				assert.strictEqual(error.message, "Missing required data");
			}
		});

		/**
		* Should throw an error when the idDespensa is missing
		*/
		it("debería lanzar error si falta el idDespensa", async () => {
			try {
				await PantryService.deleteIngredient(userId, null, 50);
				assert.fail("Debería haber fallado por falta de idDespensa");
			}
			catch (error) {
				assert.strictEqual(error instanceof AppError, true);
				assert.strictEqual(error.message, "Missing required data");
			}
		});

		/**
		* Should throw an error when the quantity is zero
		*/
		it("debería lanzar error si la cantidad a eliminar es cero", async () => {
			try {
				await PantryService.deleteIngredient(userId, idDespensa, 0);
				assert.fail("Debería haber fallado por cantidad inválida");
			}
			catch (error) {
				assert.strictEqual(error instanceof AppError, true);
				assert.strictEqual(error.message, "Missing required data");
			}
		});

		/**
		* Should throw an error when the quantity is null
		*/
		it("debería lanzar error si la cantidad a eliminar está ausente", async () => {
			try {
				await PantryService.deleteIngredient(userId, idDespensa, null);
				assert.fail("Debería haber fallado por cantidad inválida");
			}
			catch (error) {
				assert.strictEqual(error instanceof AppError, true);
				assert.strictEqual(error.message, "Missing required data");
			}
		});

		/**
		* Should throw an error when the ingredient is missing
		*/
		it("debería lanzar error si no se encuentra el item en la despensa", async () => {
			await db.query("DELETE FROM despensa WHERE id_despensa = ?", [ idDespensa ]);

			try {
				await PantryService.deleteIngredient(userId, idDespensa, 100);
				assert.fail("Debería haber fallado por item inexistente");
			}
			catch (error) {
				assert.strictEqual(error instanceof AppError, true);
				assert.strictEqual(error.message, "Error deleting ingredient");
			}
		});

		/**
		* Should throw an error when the ingredient does not belong to the user
		*/
		it("debería lanzar error si el item no pertenece al usuario", async () => {
			const otroUsuarioId = userId + 999;

			try {
				await PantryService.deleteIngredient(otroUsuarioId, idDespensa, 50);
				assert.fail("Debería haber fallado por usuario no autorizado");
			}
			catch (error) {
				assert.strictEqual(error instanceof AppError, true);
				assert.strictEqual(error.message, "Error deleting ingredient");
			}
		});
	});

	/**
     * Test group for addIngredient functionality
     * @describe Add ingredients
     */
	describe("Agregar ingredientes", () => {
		let idAceite, idLeche;

		beforeEach(async () => {
			await deletePantry();
			await deleteIngredients();
			await deleteUsers();

			// Crear usuario de prueba
			await db.query("INSERT INTO usuarios (username, password) VALUES (?, ?)", [ "test_user", "password123" ]);
			const [ user ] = await db.query("SELECT id FROM usuarios WHERE username = ?", [ "test_user" ]);
			userId = user.id;

			// Crear ingredientes de prueba
			const ingredients = [
				[ "Harina", "kg" ],
				[ "Azúcar", "kg" ],
				[ "Sal", "g" ]
			];
			await insertIngredients(ingredients);

			// Agregar ingredientes a la despensa
			const ingredientes = await db.query("SELECT id FROM ingredientes");
			const pantryItems = ingredientes.map(ing => [ userId, ing.id, 1 ]);
			await insertPantry(pantryItems);

			await db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES (?, ?)", [ "Aceite", "ml" ]);
			const [ aceite ] = await db.query("SELECT id FROM ingredientes WHERE nombre = ?", [ "Aceite" ]);
			idAceite = aceite.id;

			await db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES (?, ?)", [ "Leche", "L" ]);
			const [ leche ] = await db.query("SELECT id FROM ingredientes WHERE nombre = ?", [ "Leche" ]);
			idLeche = leche.id;
		});

		/**
         * Should successfully add a new ingredient to pantry
         */
		it("debería agregar un ingrediente correctamente", async () => {
			await PantryService.addIngredient(userId, idAceite, 500);

			const ingredientes = await PantryService.getPantryIngredients(userId);
			const agregado = ingredientes.find(ing => ing.id_ingrediente === idAceite);

			assert.ok(agregado, "No se encontró el ingrediente");
			assert.strictEqual(agregado.cantidad, 500, "Cantidad incorrecta");
		});

		/**
         * Should sum quantities when adding existing ingredient
         */
		it("debería sumar cantidades si el ingrediente ya existe", async () => {
			await PantryService.addIngredient(userId, idAceite, 200);
			await PantryService.addIngredient(userId, idAceite, 300);

			const ingredientes = await PantryService.getPantryIngredients(userId);
			const item = ingredientes.find(ing => ing.id_ingrediente === idAceite);
			assert.strictEqual(item.cantidad, 500, "No se sumaron las cantidades");
		});

		/**
         * Should prevent adding negative quantities
         */
		it("debería bloquear cantidades negativas", async () => {
			try {
				await PantryService.addIngredient(userId, idLeche, -1);
				assert.fail("Debería haber fallado");
			}
			catch (error) {
				assert.strictEqual(error instanceof AppError, true);
				assert.strictEqual(error.message, "Quantity must be positive");
			}
		});

		/**
         * Should validate required parameters
         */
		it("debería lanzar error si faltan parámetros", async () => {
			try {
				await PantryService.addIngredient();
				assert.fail("Debería haber fallado");
			}
			catch (error) {
				assert.strictEqual(error instanceof AppError, true);
			}
		});
	});

	describe("Buscar ingredientes", () => {
		const ingredients = [
			[ "harina", "gramos" ],
			[ "arroz", "gramos" ],
			[ "leche", "litros" ],
			[ "harina de avena", "gramos" ]
		];

		before(async () => {
			await deleteUsers();
			await deleteIngredients();
			await deletePantry();

			await insertIngredients(ingredients);
			await insertDummy();
			const ingredientIds = await db.query("SELECT id, nombre FROM ingredientes");

			const pantry = [
				[ 1, ingredientIds[0].id, 100 ],
				[ 1, ingredientIds[1].id, 100 ],
				[ 1, ingredientIds[2].id, 100 ],
				[ 1, ingredientIds[3].id, 100 ]
			];

			await insertPantry(pantry);
		});

		after(async () => {
			await Promise.all([ deleteIngredients(), deleteUsers() ]);
		});

		it("Debe devolver todos los ingredientes cuando no metes nada", async () => {
			const res = await PantryService.searchIngredients("", 1);

			let good = res.length === ingredients.length;

			if (good) good = ingredients.reduce((acc, [ ingName ]) => acc && res.some(({ nombre }) => ingName === nombre));

			assert.ok(good);

		});

		it("Debe devolver los ingredientes coincidentes", async () => {
			const res = await PantryService.searchIngredients("har", 1);

			const filteredIngredients = ingredients.filter(([ nombre ]) => nombre.startsWith("har"));
			let good = filteredIngredients.length === res.length;

			if (good) good = filteredIngredients.reduce((acc, [ ingName ]) => acc && res.some(({ nombre }) => ingName === nombre));

			assert.ok(good);
		});
	});
});
