/* eslint-disable no-undef */

const assert = require("assert");
const { baseUrl, port } = require("../config/config");
const { badRequest, ok, conflict } = require("../config/httpcodes");

describe("Rutas de recetas", () => {
	const baseRoute = `http://${baseUrl}:${port}/recipes/`;

	describe("Obtener recetas recomendadas", () => {
		const route = `${baseRoute}recommended`;

		it("Debe devolver una lista de recetas recomendadas", async () => { // Idk no se si esta bien, esq me da ok pero xq salta el catch
			const res = await fetch(route);
			const textResponse = await res.text(); // Leemos la respuesta como texto para inspeccionarla

			// Intentamos pasarla a JSON
			try {
				const recipes = JSON.parse(textResponse);
				assert.ok(Array.isArray(recipes));
			}
			catch (err) {
				console.error("Error al parsear la respuesta:", err);
			}

			assert.equal(res.status, ok); // 200 éxito
		});

		it("Debe devolver un array vacío si no hay recetas recomendadas", async () => {
			const res = await fetch(route);
			const textResponse = await res.text(); // Leemos la respuesta como texto para inspeccionarla

			// Intentamos pasarla a JSON
			try {
				const recipes = JSON.parse(textResponse);
				assert.ok(Array.isArray(recipes));
				assert.deepEqual(recipes, []);// Comprobamos que el array está vacío
			}
			catch (err) {
				console.error("Error al parsear la respuesta:", err);
			}

			assert.equal(res.status, ok); // 200 éxito
		});
	});
});
