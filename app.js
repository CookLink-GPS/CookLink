// App.js - Archivo principal
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const loadRoutes = require("./config/routes");
const config = require("./config/config");
const userSession = require("./middlewares/userSession"); // Importa el middleware
const logRoutes = require("./middlewares/logRoutes"); // Importa el middleware
const session = require("express-session");

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para mostrar las rutas por consola
app.use(logRoutes);
app.use(userSession);

// Configurar Express y motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
	secret: config.secret,
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}));

// Cargar rutas de forma modular
loadRoutes(app);

// Middleware centralizado de manejo de errores
app.use(errorHandler);

const port = config.port;
const server = app.listen(port, () => {
	console.log(`Servidor en ejecución en http://${config.baseUrl}:${port}`);
});


module.exports = server;

/* // middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', { error: err.message, status: err.status || 500 });
};*/

