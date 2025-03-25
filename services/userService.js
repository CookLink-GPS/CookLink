const { badRequest, conflict } = require("../config/httpcodes");
const AppError = require("../utils/AppError");
const User = require("../models/userModel");

const UserService = {
	/**
	 * Obtiene todos los usuarios a través del modelo `User`.
	 *
	 * @returns {Promise<Array>} - Devuelve una lista de todos los usuarios de la base de datos.
	 */
	getAllUsers: () => User.getAll(),
	/**
	 * Registra un nuevo usuario después de validar los datos proporcionados.
	 *
	 * @param {Object} user - Datos del usuario a registrar.
	 * @param {string} user.username - Nombre de usuario.
	 * @param {string} user.password - Contraseña del usuario.
	 * @param {string} user.confirm_password - Confirmación de la contraseña.
	 * @returns {Promise<Object>} - Devuelve el resultado de la operación de registro.
	 * @throws {AppError} - Lanza un error si los datos son inválidos o el usuario ya existe.
	 */
	registroUser: async user => {
		if (!user.username) throw new AppError("Falta el nombre de usuario", badRequest);
		if (!user.password) throw new AppError("Falta la contraseña", badRequest);
		if (!user.confirm_password) throw new AppError("Falta la contraseña", badRequest);
		if (/[\s\t]/.test(user.username)) throw new AppError("El nombre de usuario tiene espacios", badRequest);
		if (/[\s\t]/.test(user.password)) throw new AppError("La contraseña tiene espacios", badRequest);

		// Comprobamos si el usuario ya existe
		const usuarioExistente = await User.getByUsername(user.username);
		if (usuarioExistente) {
			console.log(`usuarioExistente: ${usuarioExistente.username}`);
			throw new AppError("El usuario ya existe", conflict);
		}

		return User.registro(user);
	},
	/**
	 * Elimina un usuario por su ID a través del modelo `User`.
	 *
	 * @param {number} id - ID del usuario a eliminar.
	 * @returns {Promise<Object>} - Devuelve el resultado de la operación de eliminación.
	 */
	deleteUser: id => User.delete(id),

	inciarSesion: async user => {
		if (!user.username) throw new AppError("Falta el nombre de usuario", badRequest);
		if (!user.password) throw new AppError("Falta la contraseña", badRequest);

		const userDB = await User.inicio(user);

		return userDB;
	}
};

module.exports = UserService;
