module.exports.recipeQueries = { getAllRecipes: "SELECT id, nombre, descripcion FROM recetas" };

module.exports.pantryQueries = { getPantryFromUser: "SELECT id_ingrediente, caducidad, cantidad FROM despensa WHERE id_usuario = ?" };

module.exports.containsQueries = { getFromRecipe: "SELECT id_ingrediente, unidades FROM contiene WHERE id_receta = ?" };
