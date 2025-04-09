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
	}
};

module.exports = Routes;
