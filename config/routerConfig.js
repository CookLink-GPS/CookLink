const indexRouter = require("../routes/index");
const userRouter = require("../routes/userRoutes");
const recipeRouter = require("../routes/recipeRoutes");
const ingredientRouter = require("../routes/ingredientRoutes");
const homeRouter = require("../routes/homeRoutes");
const pantryRouter = require("../routes/pantryRoutes");
const shoppingListRouter = require("../routes/shoppingListRoutes");
const cookRoutes = require("../routes/cookRoutes");
const { notFound } = require("./httpcodes");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { userRoutes, recipeRoutes, pantryRoutes, homeRoutes, indexRoutes, ingredientRoutes, shoppingListRoutes } = require("./routes");

/**
 * Configura las rutas de la aplicación y el manejo de errores 404.
 *
 * @param {Object} app - Instancia de la aplicación Express.
 */
module.exports = app => {
	// Rutas no protegidas
	app.use(indexRoutes.default, indexRouter);
	app.use(userRoutes.default, userRouter);

	// Rutas protegidas
	app.use(homeRoutes.default, authMiddleware, homeRouter);
	app.use(recipeRoutes.default, authMiddleware, recipeRouter);
	app.use(pantryRoutes.default, authMiddleware, pantryRouter);
	app.use(ingredientRoutes.default, authMiddleware, ingredientRouter);
	app.use(shoppingListRoutes.default, authMiddleware, shoppingListRouter);
	app.use(recipeRoutes.default, authMiddleware, cookRoutes);


	// Manejo de errores 404
	app.use((req, res, next) => {
		const error = new Error("Página no encontrada");
		error.status = notFound;
		next(error);
	});
};
