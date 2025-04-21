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
		add: "/anyadir"
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
	},
	shoppingListRoutes: {
		default: "/lista-compra",
		toShop: "/",
		add: "/anyadir"
	  }
};

module.exports = Routes;
