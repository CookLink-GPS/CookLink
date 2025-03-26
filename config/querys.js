exports.recipeQuerys = { getAllRecipes: "SELECT * FROM recetas" };

module.exports.recipeQueries = { getAllRecipes: "SELECT id, nombre, descripcion FROM recetas" };

module.exports.pantryQueries = {
	getPantryFromUser: "SELECT id_ingrediente, caducidad, cantidad FROM despensa WHERE id_usuario = ?",
	getIngredientsDetails: "SELECT * FROM despensa d JOIN ingredientes i ON (d.id_ingrediente = i.id) WHERE id_usuario = ? ORDER BY i.nombre",
	deleteIngredient: "DELETE FROM despensa WHERE id_usuario = ? AND id_ingrediente = ?",
	addIngrediente: "INSERT INTO despensa (id_usuario, id_ingrediente, caducidad, cantidad) VALUES (?, ?, ?, ?)",
	getPantryFromUserWithNameIngredient: "SELECT d.id_ingrediente, i.nombre, d.caducidad, d.cantidad FROM despensa d JOIN ingredientes i ON d.id_ingrediente = i.id WHERE d.id_usuario = ? ORDER BY i.nombre"
};

module.exports.containsQueries = { getFromRecipe: "SELECT id_ingrediente, unidades FROM contiene WHERE id_receta = ?" };
