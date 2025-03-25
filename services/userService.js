const { badRequest, conflict, internalServerError } = require("../config/httpcodes");
const AppError = require("../utils/AppError");
const User = require("../models/userModel");

/**
 *
 * @typedef RegisterData
 * @property {String} username
 * @property {String} password
 * @property {String} confirm_password
 *
 * @typedef User
 * @property {Number} id
 * @property {String} username
 *
 */
const UserService = {
	/**
	 * Obtiene todos los usuarios a de la aplicacion
	 *
	 * @returns {Promise<User[]>}
	 * @throws {AppError}
	 */
	getAllUsers: () => {
		try {
			return User.getAll();
		}
		catch (error) {
			throw new AppError("Error interno del servidor", internalServerError);
		}
	},
	/**
	 * Registra un nuevo usuario después de validar los datos proporcionados
	 *
	 * @param {RegisterData} user Datos del usuario a registrar
	 * @returns {Promise<Boolean>} True si se ha registrado correctamente
	 * @throws {AppError} - Lanza un error si los datos son inválidos o el usuario ya existe
	 */
	registroUser: async user => {
		if (!user.username) throw new AppError("Falta el nombre de usuario", badRequest);
		if (!user.password) throw new AppError("Falta la contraseña", badRequest);
		if (!user.confirm_password) throw new AppError("Falta la contraseña", badRequest);
		if (/[\s\t]/.test(user.username)) throw new AppError("El nombre de usuario tiene espacios", badRequest);
		if (/[\s\t]/.test(user.password)) throw new AppError("La contraseña tiene espacios", badRequest);

		// Comprobamos si el usuario ya existe
		const usuarioExistente = await User.getByUsername(user.username);
		if (usuarioExistente) throw new AppError("El usuario ya existe", conflict);

		const res = await User.registro(user);

		if (!res) throw new AppError("Error interno del servidor", internalServerError);

		return true;
	},
	/**
	 * Elimina un usuario
	 *
	 * @param {Number} id ID del usuario a eliminar
	 * @returns {Promise<Boolean>} True si se ha eliminado correctamente
	 */
	deleteUser: async id => {
		try {
			const res = await User.delete(id);

			if (!res) throw new AppError("Error interno del servidor", internalServerError);

			return true;
		}
		catch (error) {
			throw new AppError("Error interno del servidor", internalServerError);
		}
	},
	inciarSesion: async user => {
		if (!user.username) throw new AppError("Falta el nombre de usuario", badRequest);
		if (!user.password) throw new AppError("Falta la contraseña", badRequest);

		const userDB = await User.inicio(user);

		return userDB;
	}
};

module.exports = UserService;
