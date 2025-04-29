/* eslint-disable no-undef */

const assert = require("node:assert");
const { deleteIngredients, insertIngredients, insertPantry, deletePantry, deleteUsers, insertRecetas, deleteRecipes, insertContains, deleteContains, testtingSession, deleteListaCompra } = require("../testUtils");
const { baseUrl, port } = require("../../config/config");
const User = require("../../models/userModel");
const Pantry = require("../../models/pantryModel");
const { ok } = require("../../config/httpcodes");
const QUINIENTOS = 500;

describe("Rutas de cocinar", () => {

	let user;
	const baseRoute = `http://${baseUrl}:${port}/recetas/`;
	before(testtingSession);
	beforeEach( async () => {

		await deleteContains();
		await deletePantry();
		await deleteListaCompra();
		await deleteIngredients();
		await deleteRecipes();

		const ingredientes = [
			[ "harina", "gramos" ],
			[ "arroz", "gramos" ]
		];

		const ings = await insertIngredients(ingredientes);
		ids = ings.map(ing => ing.id);

		const recetas = [
			[ "receta1", "descripcion1" ],
			[ "receta2", "descripcion2" ]
		];
		const rects = await insertRecetas(recetas);
		idrs = rects.map(rec => rec.id);

		const contienen = [
			[ idrs[0], ids[0], QUINIENTOS ],
			[ idrs[1], ids[0], QUINIENTOS ],
			[ idrs[1], ids[1], QUINIENTOS ]
		];
		await insertContains(contienen);

		user = await User.getByUsername("user1");

		const pantrys = [ [ user.id, ids[0], QUINIENTOS ] ];
		await insertPantry(pantrys);
	});

	after( async () => {
		await deleteContains();
		await deletePantry();
		await deleteListaCompra();
		await deleteUsers();
		await deleteIngredients();
		await deleteRecipes();
	});

	describe("Cocinar receta", () => {

		const cookRoute = `${baseRoute}cocinar/`;

		it("Se tienen los ingredientes y se cocina la receta", async () => {

			const pantry = await Pantry.getPantryFromUser(user.id);

			const usados = pantry.map(i => JSON.stringify({
				id: i.id,
				cantidad: i.cantidad
			}));

			const res = await fetch(`${cookRoute}${idrs[0]}`, {
				method: "POST",
				body: JSON.stringify({ usados }),
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, ok);
		});

	});

	describe("Añadir a lista de la compra", () => {

		const listRoute = `${baseRoute}anyadir-a-lista/`;

		it("No se tienen ningun ingrediente y se añade a la lista", async () => {
			const pantrys = [ [ user.id, ids[1], 200 ] ];
			await insertPantry(pantrys);

			const faltantes = [ { id: ids[1], unidadesNecesarias: 300, tipoUnidad: "gramos" } ];

			// Aquí estamos serializando los objetos como en el caso de `cookRecipe`
			const faltantesSerializados = faltantes.map(ingrediente => JSON.stringify(ingrediente));

			const res = await fetch(`${listRoute}${idrs[1]}`, {
				method: "POST",
				body: JSON.stringify({ faltantes: faltantesSerializados }), // Enviamos como strings serializados
				headers: { "Content-Type": "application/json" }
			});

			assert.equal(res.status, ok);
		});

	});

});
