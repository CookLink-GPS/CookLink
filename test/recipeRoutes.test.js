/* eslint-disable no-undef */

const assert = require("assert");
const { baseUrl, port } = require("../config/config");
const { ok } = require("../config/httpcodes");

describe("Rutas de recetas", () => {
	const baseRoute = `http://${baseUrl}:${port}/recipes/`;

	describe("Obtener recetas recomendadas", () => {
		const route = `${baseRoute}recommended`;

		it("Redirige correctamente", async () => {
			const res = await fetch(route);

			assert.equal(res.status, ok); // 200 éxito
		});
	});
});
