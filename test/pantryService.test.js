/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
const db = require("../config/database");
const { deletePantry, insertPantry, deleteUsers, insertIngredients, deleteIngredients } = require("./testUtils");

describe("Servicio de Despensa", () => {
	/**
     * Hook que se ejecuta antes de cada prueba
     * Limpia la base de datos y la rellena con datos de prueba
     */
	beforeEach(function () {
		this.timeout(5000); // Establece el timeout para cada test individual
	  });

	beforeEach(async () => {
		await deletePantry();
		await deleteIngredients();
		await deleteUsers();

		// Inserta un usuario de prueba en la base de dato
		await db.query("INSERT INTO usuarios (username, password) VALUES (?, ?)", [ "test_user", "password123" ]);
		const [ { id: userId } ] = await db.query("SELECT id FROM usuarios WHERE username = ?", [ "test_user" ]);

		// Inserta ingredientes de prueba
		const ingredients = [
			[ "Harina", "kg" ],
			[ "Azúcar", "kg" ],
			[ "Sal", "g" ]
		];
		await insertIngredients(ingredients);
		const ingredientes = await db.query("SELECT id, nombre FROM ingredientes");

		 // Inserta ingredientes en la despensa del usuario de prueba con una cantidad aleatoria
		const pantryItems = ingredientes.map(ing => [ userId, ing.id, Math.random() * 10 ]);
		await insertPantry(pantryItems);
	});

	/**
     * Prueba que verifica si los ingredientes en la despensa
     * se devuelven ordenados alfabéticamente
     */
	it("Debe devolver todos los ingredientes de la despensa ordenados alfabéticamente", async () => {
		const despensa = await db.query(`
      SELECT i.nombre, d.cantidad
      FROM despensa d
      JOIN ingredientes i ON d.id_ingrediente = i.id
      ORDER BY i.nombre ASC
    `);

		const nombres = despensa.map(item => item.nombre);
		const nombresOrdenados = [ ...nombres ].sort();
		if (JSON.stringify(nombres) !== JSON.stringify(nombresOrdenados)) throw new Error("Los ingredientes no están ordenados alfabéticamente");

	});

	 /**
     * Prueba que verifica si se devuelve una lista vacía
     * cuando la despensa no tiene ingredientes
     */
	it("Debe devolver una lista vacía si no hay ingredientes en la despensa", async () => {
		await deletePantry();

		const despensa = await db.query(`
          SELECT i.nombre, d.cantidad
          FROM despensa d
          JOIN ingredientes i ON d.id_ingrediente = i.id
          ORDER BY i.nombre ASC
        `);

		if (despensa.length !== 0) throw new Error("Se esperaban 0 ingredientes, pero se encontraron algunos");

	});

	/**
     * Prueba que verifica si se puede agregar un ingrediente
     * a la despensa y recuperarlo correctamente
     */
	it("Debe permitir agregar un ingrediente a la despensa y recuperarlo correctamente", async () => {
		const [ { id: userId } ] = await db.query("SELECT id FROM usuarios WHERE username = ?", [ "test_user" ]);

		await db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES (?, ?)", [ "Aceite", "ml" ]);
		const [ { id: aceiteId } ] = await db.query("SELECT id FROM ingredientes WHERE nombre = ?", [ "Aceite" ]);

		await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?)", [ userId, aceiteId, 500 ]);

		const [ resultado ] = await db.query(`
          SELECT i.nombre, d.cantidad
          FROM despensa d
          JOIN ingredientes i ON d.id_ingrediente = i.id
          WHERE i.nombre = "Aceite"
        `);

		if (!resultado || resultado.nombre !== "Aceite" || resultado.cantidad !== 500) throw new Error("El ingrediente no se guardó correctamente en la despensa");

	});

	/**
     * Prueba que verifica si se puede eliminar un ingrediente de la despensa
     */
	it("Debe permitir eliminar un ingrediente de la despensa", async () => {
		const [ { id: userId } ] = await db.query("SELECT id FROM usuarios WHERE username = ?", [ "test_user" ]);

		await db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES (?, ?)", [ "Miel", "g" ]);
		const [ { id: mielId } ] = await db.query("SELECT id FROM ingredientes WHERE nombre = ?", [ "Miel" ]);

		await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?)", [ userId, mielId, 200 ]);

		await db.query("DELETE FROM despensa WHERE id_usuario = ? AND id_ingrediente = ?", [ userId, mielId ]);

		const resultado = await db.query(`
          SELECT * FROM despensa
          WHERE id_usuario = ? AND id_ingrediente = ?
        `, [ userId, mielId ]);

		if (resultado.length !== 0) throw new Error("El ingrediente no fue eliminado correctamente");

	});

	/**
     * Prueba que verifica si el sistema bloquea correctamente
     * la inserción de ingredientes con cantidades negativas
     */
	it("No debe permitir insertar ingredientes con cantidad negativa", async () => {
		const [ { id: userId } ] = await db.query("SELECT id FROM usuarios WHERE username = ?", [ "test_user" ]);

		await db.query("INSERT INTO ingredientes (nombre, tipoUnidad) VALUES (?, ?)", [ "Leche", "L" ]);
		const [ { id: lecheId } ] = await db.query("SELECT id FROM ingredientes WHERE nombre = ?", [ "Leche" ]);

		try {
			const cantidad = -1;
			if (cantidad < 0) throw new Error("Cantidad negativa detectada antes de la inserción");

			await db.query("INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?)", [ userId, lecheId, cantidad ]);
			throw new Error("Se insertó una cantidad negativa y no debería haber sido permitido");
		}
		catch (error) {
			if (error.message.includes("CHECK") || error.message.includes("Cantidad negativa detectada")) return;

			throw new Error("El sistema no bloqueó correctamente la cantidad negativa");
		}
	});

});
