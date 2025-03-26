// Models/userModel.js
const db = require("../config/database");
const bcrypt = require("bcrypt");
const { saltRounds } = require("../config/config");
const { userQuerys } = require("../config/queries");

/**
 *
 * @typedef User
 * @property {Number} id
 * @property {String} username
 *
 */
const User = {

	/**
	 * Obtiene todos los registros de la tabla de usuarios.
	 *
	 * @returns {Promise<User[]>} Devuelve una lista de todos los usuarios en la base de datos.
	 * @throws {Error} Lanza un error si ocurre un problema en la consulta.
	 */
	getAll: async () => {
		try {
			const res = await db.query(userQuerys.getAllUsers);
			return res.map(row => ({ ...row }));
		}
		catch (error) {
			console.log(error);
			throw Error("Error al obtener todos los usuarios");
		}
	},
	/**
	 * Busca un usuario por su nombre de usuario.
	 *
	 * @param {string} username Nombre de usuario a buscar en la base de datos.
	 * @returns {Promise<User | undefined>} Devuelve un objeto con la información del usuario encontrado.
	 * @throws {Error} Lanza un error si ocurre un problema en la consulta.
	 */
	getByUsername: async username => {
		try {
			const [ res ] = await db.query(userQuerys.getByUsername, [ username ]);

			return res && { ...res }; // Si no hay resultado, devuelve null
		}
		catch (error) {
			console.log(error);
			throw new Error("Error al buscar usuario");
		}
	},
	/**
	 * Registra un nuevo usuario en la base de datos con contraseña encriptada.
	 *
	 * @param {User} userData Datos del usuario a registrar.
	 * @returns {Promise<Boolean>} Devuelve el resultado de la inserción en la base de datos.
	 * @throws {Error} Lanza un error si ocurre un problema en la inserción.
	 */
	registro: async ({ username, password }) => {
		try {
			if (username === "" || /[\s\t]/.test(username)) throw new Error();
			if (password === "" || /[\s\t]/.test(password)) throw new Error();

			const hashedPassword = await bcrypt.hash(password, saltRounds);
			const res = await db.query(userQuerys.insertUser, [ username, hashedPassword ]);

			return !!res.affectedRows; // Si es 0, devuelve false, true en otro caso
		}
		catch (error) {
			console.log(error.message);
			throw new Error("registro Error al crear el usuario");
		}
	},
	/**
	 * Elimina un usuario de la base de datos por su ID.
	 *
	 * @param {number} id - ID del usuario a eliminar.
	 * @returns {Promise<Boolean>} - Devuelve el resultado de la eliminación en la base de datos.
	 * @throws {Error} - Lanza un error si ocurre un problema en la eliminación.
	 */
	delete: async id => {
		try {
			const res = await db.query(userQuerys.deleteUser, [ id ]);
			return !!res.affectedRows;
		}
		catch (error) {
			console.log(error);
			throw new Error("Error al eliminar el usuario");
		}
	}
};

module.exports = User;
