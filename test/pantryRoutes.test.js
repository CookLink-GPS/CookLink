/* eslint-disable no-magic-numbers */

/* eslint-disable no-undef */
const assert = require("node:assert");
const { baseUrl, port } = require("../config/config");

describe("Rutas despensa", () => {
	const baseRoute = `http://${baseUrl}:${port}/pantry`;

	describe("GET /pantry", () => {
		it("Debe devolver status 200", async () => {
			const res = await fetch(baseRoute);
			assert.strictEqual(res.status, 200);
		});
	});
});
