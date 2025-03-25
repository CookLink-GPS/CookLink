/* eslint-disable no-undef */

const assert = require("assert");
const { baseUrl, port } = require("../config/config");
const { badRequest, ok, conflict } = require("../config/httpcodes");

describe("Rutas de recetas", () => {
	const baseRoute = `http://${baseUrl}:${port}/recipes/`;

	describe("Obtener recetas recomendadas", () => {
		const route = `${baseRoute}recommended`;

		it("Debe devolver una lista de recetas recomendadas", async () => {
			const res = await fetch(route);

			assert.equal(res.status, ok); // 200 éxito
		});

		it("Debe devolver un array vacío si no hay recetas recomendadas", async () => {
			const res = await fetch(route);

			assert.equal(res.status, ok); // 200 éxito
		});
	});
});
