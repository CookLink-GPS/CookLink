const Routes = {
	userRoutes: {
		default: "/usuarios",
		getAllUsers: "/",
		login: "/inicio",
		register: "/registro",
		delete: "/borrar/:id"
	},
	recipeRoutes: {
		default: "/recetas",
		recommendations: "/recomendaciones",
		recipeInfo: "/:id"
	},
	ingredientRoutes: {
		default: "/ingredientes",
		toIngredient: "/",
		add: "/anyadir",
		ingredientesBD: "/ingredientesBD"
	},
	pantryRoutes: {
		default: "/despensa",
		show: "/",
		deleteIngredient: "/borrar/:id_despensa",
		searchAll: "/buscar",
		search: "/buscar/:filter"
	},
	homeRoutes: {
		default: "/inicio",
		show: "/"
	},
	indexRoutes: {
		default: "/",
		index: "/",
		favicon: "/favicon.ico"
	}
};

module.exports = Routes;
