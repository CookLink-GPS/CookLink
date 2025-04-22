/* eslint-disable no-undef */

const assert = require("node:assert");
const { baseUrl, port } = require("../../config/config");
const { deleteIngredients, deletePantry, deleteUsers, testtingSession, getPantryQuantity, insertIngredients, insertPantryAddIngredient, insertDummy } = require("../testUtils");
const { badRequest, ok } = require("../../config/httpcodes");
const UserService = require("../../services/userService"); // Asegúrate de que el path es correcto

describe("Rutas ingrediente", () => {
	const baseRoute = `http://${baseUrl}:${port}/ingredientes`;
	// Before(testtingSession);
	// BeforeEach(async () => {
	// 	Await deleteIngredients();
	// 	Await deletePantry();
	// });

	// After(async () => {
	// 	Await deleteIngredients();
	// 	Await deletePantry();
	// 	Await deleteUsers();
	// });

	describe("Agregar ingrediente", () => {
		const route = `${baseRoute}/anyadir`;

		// CL_003_01: Añadir un nuevo ingrediente correctamente
		it("Debe agregar un nuevo ingrediente correctamente a la despensa cuando se introduce un nombre, unidad y cantidad válidos", async () => {

			const usuario = { username: "user1", password: "12345678" };
			await UserService.login(usuario);
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: 10
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, ok);
		});

		// CL_003_02: Error si falta algún campo
		it("No debe agregar el ingrediente si falta algún campo", async () => {
			const ingrediente = {
				nombre: "",
				tipoUnidad: "kg",
				cantidad: 2,
				userId: 1
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		// CL_003_03: Error si la cantidad es menor que cero
		it("No debe agregar el ingrediente si la cantidad es menor que cero", async () => {
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: -1,
				userId: 1
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		// CL_003_03: Error si la cantidad es igual a cero
		it("No debe agregar el ingrediente si la cantidad es igual a cero", async () => {
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: 0,
				userId: 1
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		// CL_003_04: Error si no se selecciona ninguna unidad de medida
		it("No debe agregar el ingrediente si no se selecciona unidad de medida", async () => {
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "",
				cantidad: 2,
				userId: 1
			};

			const res = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, badRequest);
		});

		// CL_003_05: Si ya existe y las unidades coinciden, se suma la cantidad
		it("Si el ingrediente ya existe en la despensa y las unidades coinciden, se debe sumar la cantidad", async () => {
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: 2,
				userId: 1
			};

			const res1 = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			const ingrediente2 = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: 3,
				userId: 1
			};

			const res2 = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente2),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res1.status, ok);
			assert.equal(res2.status, ok);
		});

		// CL_003_06: Error si ya existe pero las unidades no coinciden
		it("Si el ingrediente ya existe en la despensa pero las unidades no coinciden, se debe mostrar error", async () => {
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: 2,
				userId: 1
			};

			const res1 = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente),
				headers: { "Content-Type": "application/json" }
			});

			const ingrediente2 = {
				nombre: "Tomate",
				tipoUnidad: "g",
				cantidad: 3,
				userId: 1
			};

			const res2 = await fetch(route, {
				method: "POST",
				body: JSON.stringify(ingrediente2),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res1.status, ok);
			assert.equal(res2.status, badRequest);
		});
	});


});

describe("CL_009 Agregar ingrediente a la BD", () => {
	const baseRoute = `http://${baseUrl}:${port}/ingredientes`;
	const route = `${baseRoute}/anyadirBD`;

	before(insertDummy);

	beforeEach(async () => {
		// Crea el usuario

		idUsuario = 1; // O donde se devuelva el id

		// Inserta un ingrediente
		const ingredientes = [ [ "Potato", "kg" ] ];
		const insertedIngredients = await insertIngredients(ingredientes);
		console.log("Ingredientes insertados:", insertedIngredients);
		idIngrediente = insertedIngredients[0].id;
	});

	// CL_009_01
	it("CL_009_01 Debe permitir modificar la cantidad al seleccionar un ingrediente", async () => {
		const cantidadInicial = 5;
		const cantidadExtra = 3;

		// Inserta previamente el ingrediente en la despensa
		const ingredientPantry = [ [ idUsuario, idIngrediente, cantidadInicial ] ];
		const pantryItems = await insertPantryAddIngredient(ingredientPantry);
		console.log("Items en la despensa antes de la petición:", pantryItems);

		// Verifica la cantidad inicial en la despensa
		const cantidadEnPantryAntes = await getPantryQuantity(idUsuario, idIngrediente);
		console.log("Cantidad antes de la actualización:", cantidadEnPantryAntes); // Aquí deberías ver 5

		// Simula el envío del mismo ingrediente desde el formulario
		const body = {
			idIngredienteBD: idIngrediente,
			cantidad: cantidadExtra
		};
		console.log("Ruta:", route);
		const res = await fetch(route, {
			method: "POST",
			body: JSON.stringify(body),
			headers: { "Content-Type": "application/json" }
		});

		assert.equal(res.status, ok);

		// Verifica la cantidad después de la actualización
		const nuevaCantidad = await getPantryQuantity(idUsuario, idIngrediente);
		console.log("Nueva cantidad después de la actualización:", nuevaCantidad); // Aquí deberías ver cantidadInicial + cantidadExtra

		// Verifica que la cantidad final sea correcta
		assert.equal(nuevaCantidad, cantidadInicial + cantidadExtra); // Verifica si la cantidad total es 8
	});
});

