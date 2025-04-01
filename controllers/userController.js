const UserService = require("../services/userService");
const { validationResult } = require("express-validator");
const { renderView } = require("../middlewares/viewHelper"); // Importamos la función centralizada
const { ok, badRequest, unauthorized } = require("../config/httpcodes");
const bcrypt = require("bcrypt");

/**
 * Obtiene todos los usuarios y los renderiza en la vista "users"
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await UserService.getAllUsers();
		res.render("users", { users });
	}
	catch (err) {
		next(err.mensajeError);
	}
};

exports.login = async (req, res) => {


	const { username, password } = req.body;
	try {
		const user = await UserService.inciarSesion( { username, password });

		// Comparar la contraseña hashada en la base de datos
		const valido = await bcrypt.compare(password, user.password);
		if (!valido) return res.status(unauthorized).json({ error: "Credenciales inválidas" });

		req.session.userId = user.id; // Guarda el ID del usuario en la sesión
		req.session.username = user.username;

		console.log("Sesión guardada:", req.session); // Debugging
		renderView(res, "inicio", ok, { usuario: req.session.username });
	}
	catch (error) {
		console.error(error);
		renderView(res, "login", badRequest, { mensajeError: "Las Credenciales de acceso son incorrectas" });
	}
};

/**
 * Redirige a la página de registro de usuario.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
exports.toRegistro = (req, res, next) => {
	try {
		renderView(res, "registro", ok);
	}
	catch (err) {
		next(err.mensajeError);
	}
};

exports.toLogin = (req, res, next) => {
	try {
		renderView(res, "login", ok);
	}
	catch (err) {
		next(err.mensajeError);
	}
};


/**
 * Registra un nuevo usuario en la base de datos y muestra mensajes de éxito o error según el resultado.
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.registroUser = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("Error details: ", JSON.stringify(errors.array(), null));
		return renderView(res, "registro", badRequest, { mensajeError: errors.array() });
	}

	try {
		await UserService.registroUser(req.body);
		renderView(res, "inicio", ok, { mensajeExito: "Usuario registrado correctamente." });
	}
	catch (err) {
		console.error("Error al crear usuario:", err.message);
		renderView(res, "registro", err.status, { mensajeError: [ err.message ] });
	}
};

/**
 * Elimina un usuario de la base de datos por su ID y devuelve una respuesta en formato JSON.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
exports.deleteUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		await UserService.deleteUser(id);
		res.status(ok).json({ message: "Usuario eliminado correctamente" });
	}
	catch (err) {
		next(err.mensajeError);
	}
};
