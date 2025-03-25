/* eslint-disable no-magic-numbers */
const bcrypt = require("bcrypt");
const UserService = require("../services/userService");
const { created, internalServerError, unauthorized } = require("../config/httpcodes");

// Registro de usuario
const registerUser = async (req, res) => {
	const { username, password } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		await UserService.createUser(username, hashedPassword);
		res.status(created).json({ message: "Usuario registrado con éxito" });
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
		console.log("llegue1");
		if (!user || !await bcrypt.compare(password, user.password)) return res.status(unauthorized).json({ error: "Credenciales inválidas" });
		console.log("llegue2");
		req.session.userId = user.id; // Guarda el ID del usuario en la sesión
		res.redirect("/inicio");
		res.json({ message: "Inicio de sesión exitoso" });
	}
	catch (error) {
		res.status(internalServerError).json({ error: "Error al iniciar sesión" });
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
