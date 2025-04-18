const UserService = require("../services/userService");
const { validationResult } = require("express-validator");
const { renderView } = require("../middlewares/viewHelper"); // Importamos la función centralizada
const { ok, badRequest } = require("../config/httpcodes");

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
		const user = await UserService.login({ username, password });
		req.session.user = { ...user };

		res.redirect("/inicio");
	}
	catch (err) {
		const mensajeError = {};
		if (err.message.toLowerCase().includes("usuario")) mensajeError.username = err.message;
		if (err.message.toLowerCase().includes("contraseña")) mensajeError.password = err.message;
		if (Object.keys(mensajeError).length === 0) mensajeError.general = "Las credenciales de acceso son incorrectas";

		renderView(res, "login", badRequest, { mensajeError, formData: req.body });
	}
};

/**
 * Redirige a la página de registro de usuario.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
exports.toRegister = (req, res, next) => {
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
exports.register = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const mensajeError = {};
		errors.array().forEach(err => {
			if (err.msg.toLowerCase().includes("nombre")) mensajeError.nombre = err.msg;
			if (err.msg.toLowerCase().includes("contraseña")) mensajeError.password = err.msg;
			if (err.msg.toLowerCase().includes("confirmar")) mensajeError.confirm_password = err.msg;
		});

		if (Object.keys(mensajeError).length === 0) mensajeError.general = "Hay errores en el formulario.";

		return renderView(res, "registro", badRequest, { mensajeError, formData: req.body });
	}


	try {
		await UserService.register(req.body);
		renderView(res, "registro", ok, { mensajeExito: "Usuario registrado correctamente.", formData: {} });
	}
	catch (err) {
		const mensajeError = {};
		if (err.message.toLowerCase().includes("nombre")) mensajeError.nombre = err.message;
		if (err.message.toLowerCase().includes("contraseña")) mensajeError.password = err.message;
		if (err.message.toLowerCase().includes("confirmar")) mensajeError.confirm_password = err.message;
		if (Object.keys(mensajeError).length === 0) mensajeError.general = err.message;

		renderView(res, "registro", badRequest, { mensajeError, formData: req.body });
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
