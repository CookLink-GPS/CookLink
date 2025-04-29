// App.js - Archivo principal
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const loadRoutes = require("./config/routerConfig");
const config = require("./config/config");
const logRoutes = require("./middlewares/logRoutes"); // Importa el middleware
const session = require("express-session");
const testSession = require("./middlewares/testSession");

const COOKIE_EXPIRES = 86400000; // 1 dia

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para mostrar las rutas por consola
app.use(logRoutes);

// Configurar Express y motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
	secret: config.secret,
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: COOKIE_EXPIRES }
}));

if (process.env.MODE !== "prod" && process.env.MODE !== "dev") app.use(testSession);

// Cargar rutas de forma modular
loadRoutes(app);

// Middleware centralizado de manejo de errores
app.use(errorHandler);


const port = config.port;

const server = app.listen(port, config.baseUrl, () => {
	console.log(`Servidor en ejecución en http://${config.baseUrl}:${port}`);
});


module.exports = server;

