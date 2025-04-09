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
	}
};

module.exports = Routes;
