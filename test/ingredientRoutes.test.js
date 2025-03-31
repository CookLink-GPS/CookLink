/* eslint-disable no-undef */
/* eslint-disable no-magic-numbers */
const assert = require("node:assert");
const { baseUrl, port } = require("../config/config");
const { insertIngredients, deleteIngredients } = require("./testUtils");

describe("Rutas ingrediente", () => {
	const baseRoute = `http://${baseUrl}:${port}/ingredients`;

	beforeEach(async () => {
		await deleteIngredients();
	});

	after(async () => {
		await deleteIngredients();
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
});
