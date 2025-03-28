exports.recipeQuerys = { getAllRecipes: "SELECT * FROM recetas" };

module.exports.recipeQueries = { getAllRecipes: "SELECT id, nombre, descripcion FROM recetas" };

module.exports.pantryQueries = {
	getPantryFromUser: "SELECT id_ingrediente, cantidad FROM despensa WHERE id_usuario = ?",
	getIngredientsDetails: "SELECT * FROM despensa d JOIN ingredientes i ON (d.id_ingrediente = i.id) WHERE id_usuario = ? ORDER BY i.nombre",
	deleteIngredient: "DELETE FROM despensa WHERE id_usuario = ? AND id_ingrediente = ?"
};

module.exports.containsQueries = { getFromRecipe: "SELECT id_ingrediente, unidades FROM contiene WHERE id_receta = ?" };
