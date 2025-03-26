/* eslint-disable no-magic-numbers */
const bcrypt = require("bcrypt");
const UserService = require("../services/userService");
const { internalServerError } = require("../config/httpcodes");

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

// Cierre de sesión
const logoutUser = (req, res) => {
	req.session.destroy(err => {
		if (err) return res.status(internalServerError).json({ error: "Error al cerrar sesión" });
		res.json({ message: "Sesión cerrada con éxito" });
	});
};

module.exports = { registerUser, logoutUser };
