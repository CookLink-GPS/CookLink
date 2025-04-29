module.exports.pantryQueries = {
	addingredient: "INSERT INTO despensa (id_usuario, id_ingrediente, cantidad) VALUES (?, ?, ?)",
	getPantryFromUser: `
        SELECT d.id_despensa, d.id_ingrediente, i.nombre AS nombre_ingrediente, d.cantidad,  i.tipoUnidad
        FROM despensa d
        JOIN ingredientes i ON d.id_ingrediente = i.id
        WHERE d.id_usuario = ?
    `,
	deleteIngredient: "DELETE FROM despensa WHERE id_usuario = ? AND id_ingrediente = ?",
	getPantryItemByIngredient: "SELECT * FROM despensa WHERE id_usuario = ? AND id_ingrediente = ?",
	updateIngredientQuantity: "UPDATE despensa SET cantidad = ? WHERE id_despensa = ?",
	getPantryItemById: "SELECT * FROM despensa WHERE id_despensa = ?",
	getIngredientsDetails: `
		SELECT d.id_despensa, d.id_ingrediente, i.nombre AS nombre_ingrediente, d.cantidad, i.tipoUnidad
		FROM despensa d
		JOIN ingredientes i ON d.id_ingrediente = i.id
		WHERE d.id_usuario = ?
	`
};

module.exports.userQueries = {
	getAllUsers: "SELECT id, username FROM usuarios ORDER BY id",
	getByUsername: "SELECT id, username, password FROM usuarios WHERE username = ?",
	insertUser: "INSERT INTO usuarios (username, password) VALUES (?, ?)",
	deleteUser: "DELETE FROM usuarios WHERE id = ?"
};

module.exports.recipeQueries = {
	getAllRecipes: "SELECT id, nombre, descripcion FROM recetas",
	getRecipeById: "SELECT * FROM recetas WHERE id = ?",
	getIngredients: "SELECT i.nombre AS ingrediente, i.tipoUnidad, c.unidades FROM contiene c JOIN ingredientes i ON c.id_ingrediente = i.id WHERE c.id_receta = ?;"
};

module.exports.ingredientQueries = {
	create: "INSERT INTO ingredientes (nombre, tipoUnidad) VALUES (?, ?)",
	findByName: "SELECT id, nombre, tipoUnidad FROM ingredientes WHERE nombre = ? LIMIT 1",
	getAll: "SELECT * FROM ingredientes",
	getById: "SELECT * FROM ingredientes WHERE id = ?"
};

module.exports.containsQueries = { getFromRecipe: "SELECT i.id, i.nombre, c.unidades, i.tipoUnidad FROM contiene c JOIN ingredientes i ON i.id = id_ingrediente WHERE c.id_receta = ?;" };

module.exports.shoppingListQueries = {
	findItem: `
		SELECT id_lista_compra, cantidad, unidad_medida
		FROM lista_compra
		WHERE id_usuario = ? AND id_ingrediente = ?
  `,
	addItem: `
	  INSERT INTO lista_compra
		(id_usuario, id_ingrediente, cantidad, unidad_medida)
	  VALUES (?, ?, ?, ?)
	`,
	updateQuantity: `
	  UPDATE lista_compra
	  SET cantidad = ?
	  WHERE id_lista_compra = ?
	`,
	getList: `
    SELECT 
      li.id_lista_compra, 
      i.nombre, 
      li.cantidad, 
      li.unidad_medida
    FROM lista_compra li
    JOIN ingredientes i ON li.id_ingrediente = i.id
    WHERE li.id_usuario = ?
    ORDER BY i.nombre ASC
  `,
	getById: `
	SELECT id_lista_compra, id_usuario, id_ingrediente, cantidad
	FROM lista_compra
	WHERE id_lista_compra = ?
	`,
	deleteItem: `
	DELETE FROM lista_compra
	WHERE id_lista_compra = ?
	`
};
