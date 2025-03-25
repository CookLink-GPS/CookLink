const UserService = require("../services/userService");
const { validationResult } = require("express-validator");
const { renderView } = require("../middlewares/viewHelper"); // Importamos la función centralizada
const { ok, badRequest, conflict } = require("../config/httpcodes");

/**
 * Obtiene todos los usuarios y los renderiza en la vista "users".
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP que renderiza la vista con los usuarios.
 * @param {Function} next - Función para manejar errores.
 */
exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await UserService.getAllUsers();
		res.render("users", { users });
	}
	catch (err) {
		next(err);
	}
};

/**
 * Crea un nuevo usuario a partir del nombre recibido en la solicitud y redirige a la lista de usuarios.
 *
 * @param {Object} req - Objeto de solicitud HTTP con el nombre en `req.body`.
 * @param {Object} res - Objeto de respuesta HTTP que redirige a la lista de usuarios.
 * @param {Function} next - Función para manejar errores.
 */
exports.createUser = async (req, res, next) => {
	try {
		const { name } = req.body;
		await UserService.createUser(name);
		res.redirect("/users");
	}
	catch (err) {
		next(err);

	}
};

exports.inciarSesion = async (req, res) => {
	try {
		const { username, password } = req.body;
		await UserService.inciarSesion({ username, password });
		res.redirect("/inicio");
	}
	catch (err) {
		console.error("Error al iniciar sesion:", err.message);
	}
};

/**
 * Redirige a la página de registro de usuario.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP que renderiza la vista de registro.
 * @param {Function} next - Función para manejar errores.
 */
exports.toRegistro = (req, res, next) => {
	try {
		renderView(res, "registro", ok);
	}
	catch (err) {
		next(err);
	}
};

exports.toLogin = (req, res, next) => {
	try {
		renderView(res, "login", ok);
	}
	catch (err) {
		next(err);
	}
};


/**
 * Registra un nuevo usuario en la base de datos y muestra mensajes de éxito o error según el resultado.
 *
 * @param {Object} req - Objeto de solicitud HTTP con los datos del usuario en `req.body`.
 * @param {Object} res - Objeto de respuesta HTTP que renderiza la vista de registro con un mensaje de éxito o error.
 */
exports.registroUser = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("Error details: ", JSON.stringify(errors.array(), null));
		return renderView(res, "registro", badRequest, { mensajeError: errors.array() });
	}

	try {
		console.log(req.body);

		await UserService.registroUser(req.body);
		res.redirect("/inicio");

	}
	catch (err) {
		console.error("Error al crear usuario:", err.message);

		// eslint-disable-next-line no-warning-comments
		// CHECK este if seguramente sobre
		if (err.status === conflict) {
			console.log("Error details2: ", JSON.stringify(errors.array(), null));
			errors.errors.push({ msg: err.message });
			return renderView(res, "registro", conflict, {
				mensajeError: errors.array()
				// Enviar un array con el mensaje de error
			});
		}

		renderView(res, "registro", err.status, { mensajeError: [ err.message ] });
	}
};

/**
 * Elimina un usuario de la base de datos por su ID y devuelve una respuesta en formato JSON.
 *
 * @param {Object} req - Objeto de solicitud HTTP con el ID del usuario en `req.params.id`.
 * @param {Object} res - Objeto de respuesta HTTP que devuelve un mensaje de confirmación en JSON.
 * @param {Function} next - Función para manejar errores.
 */
exports.deleteUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		await UserService.deleteUser(id);
		res.status(ok).json({ message: "Usuario eliminado correctamente" });
	}
	catch (err) {
		next(err);
	}
};
