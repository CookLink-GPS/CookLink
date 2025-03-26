/* eslint-disable no-magic-numbers */
const bcrypt = require("bcrypt");
const UserService = require("../services/userService");
const { internalServerError, unauthorized, ok } = require("../config/httpcodes");
const { renderView } = require("../middlewares/viewHelper");

// Registro de usuario
const registerUser = async (req, res) => {
	const { username, password } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		await UserService.registroUser( { username, hashedPassword } );
		console.log("Sesión guardada:", req.session); // Debugging

		res.redirect("/inicio");
	}
	catch (error) {
		res.status(internalServerError).json({ error: "Error al registrar el usuario" });
	}
};

// Inicio de sesión
const loginUser = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await UserService.inciarSesion( { username, password });
		const valido = await bcrypt.compare(password, user.password);

		if (!valido) return res.status(unauthorized).json({ error: "Credenciales inválidas" });

		req.session.userId = user.id; // Guarda el ID del usuario en la sesión
		req.session.username = user.username;

		console.log("Sesión guardada:", req.session); // Debugging

		// C res.redirect("/inicio");
		//renderView(res, "inicio", ok);
		renderView(res, "inicio", ok, { usuario: req.session.username });
	}
	catch (error) {
		console.error(error);
		// Cres.status(internalServerError).json({ error: "Error al iniciar sesión" });
		renderView(res, "login", error.status, { mensajeError: "Error al iniciar sesión" });
	}
};

// Cierre de sesión
const logoutUser = (req, res) => {
	req.session.destroy(err => {
		if (err) return res.status(internalServerError).json({ error: "Error al cerrar sesión" });
		res.json({ message: "Sesión cerrada con éxito" });
	});
};

module.exports = { registerUser, loginUser, logoutUser };
