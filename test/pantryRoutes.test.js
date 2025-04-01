/* eslint-disable no-magic-numbers */

/* eslint-disable no-undef */
const assert = require("node:assert");
const { baseUrl, port } = require("../config/config");
const { insertIngredients, insertDummy, insertPantry, deleteIngredients, deleteUsers } = require("./testUtils");
const db = require("../config/database");

describe("Rutas despensa", () => {
	const baseRoute = `http://${baseUrl}:${port}/pantry`;

	 /**
         * Prueba para verificar que la solicitud GET a la ruta de la despensa
         * devuelve un estado HTTP 200 (OK), lo que indica que la API responde correctamente.
         */
	describe("Obtener despensa", () => {
		it("Debe devolver status 200", async () => {
			const res = await fetch(baseRoute);

			 // Verifica que el código de estado de la respuesta sea 200
			assert.strictEqual(res.status, 200);
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


		it("Debe devolver todos los ingredientes si no introduce nada", async () => {
			const { ingredientes: appIngredients } = await fetch(`${baseRoute}/search`).then(res => res.json());

			let f = appIngredients.length !== ingredients.length;

			if (!f) ingredients.forEach(ing => {
				const found = appIngredients.some(({ nombre }) => nombre === ing[0]);
				if (!found) f = true;

			});


			assert.ok(!f);
		});


		it("Debe devolver los ingredientes coincidentes", async () => {
			const { ingredientes: appIngredients } = await fetch(`${baseRoute}/search/hari`).then(res => res.json());


			const filteredIngredients = ingredients.filter(([ nombre ]) => nombre.startsWith("har"));
			let f = appIngredients.length !== filteredIngredients.length;

			if (!f) filteredIngredients.forEach(ing => {
				appIngredients.find(({ nombre }) => {
					f = ing[0] !== nombre;
				});
			});

			assert.ok(!f);
		});
	});
});
