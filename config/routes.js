const Routes = {
	userRoutes: {
		default: "/usuarios",
		getAllUsers: "/",
		login: "/inicio",
		register: "/registro",
		delete: "borrar/:id"
	},
	recipeRoutes: {
		default: "/recetas",
		recommendations: "recomendaciones",
		recipeInfo: "/:id"
	},
	ingredientRoutes: {
		default: "/ingredientes",
		toIngredient: "/",
		add: "/añadir"
	},
	pantryRoutes: {
		default: "/despensa",
		show: "/",
		deleteIngredient: "/borrar/:id_despensa",
		searchAll: "/buscar",
		search: "/buscar/:filter"
	}
};

module.exports = Routes;
