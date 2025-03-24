// Models/userModel.js
const db = require("../config/database");
const bcrypt = require("bcrypt");
const { saltRounds } = require("../config/config");

const nombreTabla = "usuarios";

const User = {

	/**
	 * Obtiene todos los registros de la tabla de usuarios.
	 *
	 * @returns {Promise<Array>} - Devuelve una lista de todos los usuarios en la base de datos.
	 * @throws {Error} - Lanza un error si ocurre un problema en la consulta.
	 */
	getAll: async () => {
		try {
			return await db.query(`SELECT * FROM ${nombreTabla}`);
		}
		catch (error) {
			console.log(error);
			throw Error("Error al obtener todos los usuarios");
		}
	},
	/**
	 * Busca un usuario por su nombre de usuario.
	 *
	 * @param {string} username - Nombre de usuario a buscar en la base de datos.
	 * @returns {Promise<Object>} - Devuelve un objeto con la información del usuario encontrado.
	 * @throws {Error} - Lanza un error si ocurre un problema en la consulta.
	 */
	getByUsername: async username => {
		try {
			// Console.log("Datos recibidos en el modelo:", { username });
			const sql = `SELECT username FROM ${nombreTabla} WHERE username = ?`;
			const [ result ] = await db.query(sql, [ username ]); // Destructuring para obtener solo el resultado
			return result;
		}
		catch (error) {
			console.log(error);
			throw new Error("Error al buscar usuario");
		}
	},
	/**
	 * Registra un nuevo usuario en la base de datos con contraseña encriptada.
	 *
	 * @param {Object} userData - Datos del usuario a registrar.
	 * @param {string} userData.username - Nombre de usuario.
	 * @param {string} userData.password - Contraseña del usuario.
	 * @returns {Promise<Object>} - Devuelve el resultado de la inserción en la base de datos.
	 * @throws {Error} - Lanza un error si ocurre un problema en la inserción.
	 */
	registro: async ({ username, password }) => {
		try {
			if (username === "" || /[\s\t]/.test(username)) throw new Error();
			if (password === "" || /[\s\t]/.test(password)) throw new Error();
			const sql = `INSERT INTO ${nombreTabla} (username, password) VALUES (?, ?)`;
			const hashedPassword = await bcrypt.hash(password, saltRounds);
			return db.query(sql, [ username, hashedPassword ]);
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
	 * @returns {Promise<Object>} - Devuelve el resultado de la eliminación en la base de datos.
	 * @throws {Error} - Lanza un error si ocurre un problema en la eliminación.
	 */
	delete: async id => {
		try {
			return await db.query(`DELETE FROM ${nombreTabla} WHERE id = ?`, [ id ]);
		}
		catch (error) {
			console.log(error);
			throw new Error("Error al eliminar el usuario");
		}
	},

	inicio: async ({ username, password }) => {
		try {
			const [ usuarioDB ] = await db.query(`SELECT username,password from ${nombreTabla} where username = ?`, [ username ]);
			return await bcrypt.compare(password, usuarioDB.password);
		}
		catch (error) {
			console.log(error);
			throw new Error("Error al iniciar sesion");
		}


	}
};
module.exports = User;
