/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
const assert = require("assert");
const db = require("../config/database");
const PantryService = require("../services/pantryService");
const Pantry = require("../models/pantryModel");
const AppError = require("../utils/AppError");
const { deletePantry, insertPantry, deleteUsers, insertIngredients, deleteIngredients } = require("./testUtils");

describe("Servicio de Despensa", () => {
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
     * Test group for getPantryIngredients functionality
     * @describe Get pantry ingredients
     */
	describe("Obtener ingredientes de despensa", () => {
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
		/**
         * Should return ingredients in alphabetical order
         */
		it("debería devolver ingredientes ordenados alfabéticamente", async () => {
			const mockIngredients = [
				{ nombre: "Azúcar", tipoUnidad: "kg" },
				{ nombre: "Harina", tipoUnidad: "kg" },
				{ nombre: "Sal", tipoUnidad: "g" }
			];

			const originalGetIngredientsDetails = Pantry.getIngredientsDetails;
			Pantry.getIngredientsDetails = () => Promise.resolve(mockIngredients);

			try {
				const ingredientes = await PantryService.getIngredientsDetails(userId);
				const nombres = ingredientes.map(item => item.nombre);
				const nombresOrdenados = [ ...nombres ].sort();

				assert.strictEqual(
					JSON.stringify(nombres),
					JSON.stringify(nombresOrdenados),
					"Los ingredientes no están ordenados correctamente"
				);
			}
			finally {
				Pantry.getIngredientsDetails = originalGetIngredientsDetails;
			}
		});

		/**
         * Should return empty array when pantry has no ingredients
         */
		it("debería devolver lista vacía cuando no hay ingredientes", async () => {
			const originalGetIngredientsDetails = Pantry.getIngredientsDetails;
			Pantry.getIngredientsDetails = () => Promise.resolve([]);

			try {
				await deletePantry();
				const ingredientes = await PantryService.getIngredientsDetails(userId);
				assert.strictEqual(ingredientes.length, 0, "Debería estar vacía");
			}
			finally {
				Pantry.getIngredientsDetails = originalGetIngredientsDetails;
			}
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
		beforeEach(async () => {
			await db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES (?, ?)", [ "Miel", "g" ]);
			const [ ingrediente ] = await db.query("SELECT id FROM ingredientes WHERE nombre = ?", [ "Miel" ]);
			idIngrediente = ingrediente.id;

			await db.query(
				"INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?)",
				[ userId, idIngrediente, 200 ]
			);

			const [ item ] = await db.query("SELECT id_despensa FROM despensa WHERE id_ingrediente = ?", [ idIngrediente ]);
			idDespensa = item.id_despensa;
		});

		/**
         * Should completely remove an ingredient when full quantity is deleted
         */
		it("debería eliminar completamente un ingrediente", async () => {
			await PantryService.deleteIngredient(userId, idDespensa, 200);

			const ingredientes = await PantryService.getPantryIngredients(userId);
			const eliminado = ingredientes.some(ing => ing.id_ingrediente === idIngrediente);
			assert.strictEqual(eliminado, false, "El ingrediente no se eliminó");
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
	});

	/**
     * Test group for addIngredient functionality
     * @describe Add ingredients
     */
	describe("Agregar ingredientes", () => {
		let idAceite, idLeche;

		/**
         * Setup for add ingredient tests
         */
		beforeEach(async () => {
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
});
