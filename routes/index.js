// Routes/index.js
const pantryRoutes = require("./pantryRoutes");
const express = require("express");
const { noContent } = require("../config/httpcodes");
const router = express.Router();

/**
 * Ruta para renderizar la página principal de la aplicación.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {void} - Renderiza la vista "index".
 */
router.get("/", (req, res) => {
	res.render("index");
});

/**
 * Ruta para manejar la solicitud del favicon.ico.
 * Evita que se devuelva un error 404 por la solicitud de favicon.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {void} - Responde con un estado 204 (sin contenido) para evitar el error 404.
 */
router.get("/favicon.ico", (req, res) => {
	res.status(noContent).end(); // No devuelve nada y evita el error
});

// O si tienes un favicon.ico:
// Router.get('/favicon.ico', (req, res) => {
//     Res.sendFile(path.join(__dirname, '../public/favicon.ico'));
//   });

router.use("/pantry", pantryRoutes);

module.exports = router;
