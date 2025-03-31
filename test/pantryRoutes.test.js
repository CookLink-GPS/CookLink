/* eslint-disable no-magic-numbers */

/* eslint-disable no-undef */
const assert = require("node:assert");
const { baseUrl, port } = require("../config/config");

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
});
