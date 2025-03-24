module.exports.recipeQueries = {
	getAllRecipes: "SELECT id, nombre, descripcion FROM recetas",
	getRecipeById: "SELECT * FROM recetas WHERE id = ?",
	getIngredients: "SELECT i.nombre AS ingrediente, i.tipoUnidad, c.unidades FROM contiene c JOIN ingredientes i ON c.id_ingrediente = i.id WHERE c.id_receta = ?;"
};

module.exports.pantryQueries = { getPantryFromUser: "SELECT id_ingrediente, caducidad, cantidad FROM despensa WHERE id_usuario = ?" };

module.exports.containsQueries = { getFromRecipe: "SELECT id_ingrediente, unidades FROM contiene WHERE id_receta = ?" };
