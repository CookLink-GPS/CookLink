module.exports.recipeQueries = { getAllRecipes: "SELECT id, nombre, descripcion FROM recetas" };

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

module.exports.containsQueries = { getFromRecipe: "SELECT id_ingrediente, unidades FROM contiene WHERE id_receta = ?" };
