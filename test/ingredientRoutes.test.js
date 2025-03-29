/* eslint-disable no-undef */
/* eslint-disable no-magic-numbers */
const assert = require("node:assert");
const { baseUrl, port } = require("../config/config");
const { insertIngredients, deleteIngredients, deletePantryItems } = require("./testUtils");
const { badRequest, ok, conflict } = require("../config/httpcodes");

describe("Rutas ingrediente", () => {
	const baseRoute = `http://${baseUrl}:${port}/ingredients`;

	beforeEach(async () => {
		await deleteIngredients();
		await deletePantryItems();
	});

	after(async () => {
		await deleteIngredients();
		await deletePantryItems();
	});

	describe("Filtrar ingredientes", () => {
	    const filterRoute = `${baseRoute}/filter`;

		const ingredientesBD = [
			[ "harina", "gramos" ],
			[ "arroz", "gramos" ],
			[ "leche", "litros" ],
			[ "harina de avena", "gramos" ]
		];

		it("Debe devolver todos los ingredientes si no se proporciona filtro", async () => {
			await insertIngredients(ingredientesBD);

			const { ingredientes } = await fetch(filterRoute).then(res => res.json());

			ingredientesBD.forEach(ingrediente => {
				assert.ok(ingredientes.find(({ nombre, tipoUnidad }) => ingrediente[0] === nombre && ingrediente[1] === tipoUnidad));
			});

			assert.ok(ingredientes.length > 0);
		});

		it("Debe devolver todos los ingredientes coincidentes", async () => {
			await insertIngredients(ingredientesBD);

			const { ingredientes } = await fetch(`${filterRoute}/harina`).then(res => res.json());

			const harinas = ingredientesBD.filter(([ nombre ]) => nombre.startsWith("harina"));

			harinas.forEach(ingrediente => {
				assert.ok(ingredientes.find(({ nombre, tipoUnidad }) => ingrediente[0] === nombre && ingrediente[1] === tipoUnidad));
			});

			assert.strictEqual(ingredientes.length, harinas.length);
		});
	});


	describe("Agregar ingrediente", () => {
		const route = `${baseRoute}/add`;

		// CL_003_01: Añadir un nuevo ingrediente correctamente
		it("Debe agregar un nuevo ingrediente correctamente a la despena cuando se introduce un nombre, unidad y cantidad válidos", async () => {
			const ingrediente = {
				nombre: "Tomate",
				tipoUnidad: "kg",
				cantidad: 2,
				userId: 1
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
			assert.equal(res2.status, conflict);
		});
	});
});
