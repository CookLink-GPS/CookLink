const indexRouter = require("../routes/index");
const userRouter = require("../routes/userRoutes");
const recipeRouter = require("../routes/recipeRoutes");
const ingredientRouter = require("../routes/ingredientRoutes");
const inicioRouter = require("../routes/inicioRoutes");
const { notFound } = require("./httpcodes");

/**
 * Configura las rutas de la aplicación y el manejo de errores 404.
 *
 * @param {Object} app - Instancia de la aplicación Express.
 */
module.exports = app => {
	app.use("/", indexRouter);
	app.use("/users", userRouter);
	app.use("/recipes", recipeRouter);
	app.use("/ingredients", ingredientRouter);
	app.use("/inicio", inicioRouter);

	// Manejo de errores 404
	app.use((req, res, next) => {
		const error = new Error("Página no encontrada");
		error.status = notFound;
		next(error);
	});
};
