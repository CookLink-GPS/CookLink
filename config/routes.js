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
		recipeInfo: "/:id",
		cook: "/cocinar/:id",
		check: "/comprobar/:id",
		addToShoppingList: "/anyadir-a-lista/:id"
	},
	ingredientRoutes: {
		default: "/ingredientes",
		toIngredient: "/",
		add: "/anyadir",
		addBD: "/anyadirBD",
		ingredientesBD: "anyadirBD/ok"
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
		add: "/anyadir",
		show: "/",
		bought: "/comprado/:id"
	  }
};

module.exports = Routes;
