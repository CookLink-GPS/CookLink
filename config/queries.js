module.exports.pantryQueries = {
	getPantryFromUser: `
        SELECT d.id_despensa, d.id_ingrediente, i.nombre AS nombre_ingrediente, d.cantidad
        FROM despensa d
        JOIN ingredientes i ON d.id_ingrediente = i.id
        WHERE d.id_usuario = ?
    `,
	deleteIngredient: "DELETE FROM despensa WHERE id_usuario = ? AND id_ingrediente = ?",
	updateIngredientQuantity: "UPDATE despensa SET cantidad = ? WHERE id_despensa = ?",
	getPantryItemById: "SELECT * FROM despensa WHERE id_despensa = ?"
};

module.exports.userQueries = {
	getAllUsers: "SELECT id, username FROM usuarios ORDER BY id",
	getByUsername: "SELECT id, username FROM usuarios WHERE username = ?",
	insertUser: "INSERT INTO usuarios (username, password) VALUES (?, ?)",
	deleteUser: "DELETE FROM usuarios WHERE id = ?"
};

module.exports.recipeQueries = { getAllRecipes: "SELECT id, nombre, descripcion FROM recetas" };

module.exports.containsQueries = {
	getFromRecipe: `
	SELECT i.id, i.nombre, c.unidades, i.tipoUnidad FROM contiene c 
	JOIN ingredientes i ON i.id = id_ingrediente WHERE c.id_receta = ?;
	`
};
