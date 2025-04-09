const indexRouter = require("../routes/index");
const userRouter = require("../routes/userRoutes");
const recipeRouter = require("../routes/recipeRoutes");
const ingredientRouter = require("../routes/ingredientRoutes");
const inicioRouter = require("../routes/inicioRoutes");
const pantryRouter = require("../routes/pantryRoutes");
const { notFound } = require("./httpcodes");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { userRoutes, recipeRoutes, pantryRoutes } = require("./routes");

/**
 * Configura las rutas de la aplicación y el manejo de errores 404.
 *
 * @param {Object} app - Instancia de la aplicación Express.
 */
module.exports = app => {

	// Rutas protegidas
	app.use("/inicio", authMiddleware, inicioRouter);
	app.use(recipeRoutes.default, authMiddleware, recipeRouter);
	app.use(pantryRoutes.default, authMiddleware, pantryRouter);
	app.use(recipeRoutes.default, authMiddleware, ingredientRouter);

	// Rutas no protegidas
	app.use(userRoutes.default, userRouter);
	app.use("/", indexRouter);

	// Manejo de errores 404
	app.use((req, res, next) => {
		const error = new Error("Página no encontrada");
		error.status = notFound;
		next(error);
	});
};
