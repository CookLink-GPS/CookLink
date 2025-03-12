// models/userModel.js
const db = require('../config/database');
const bcrypt = require('bcrypt');
const { salt_rounds } = require('../config/config');

const nombreTabla = 'usuarios';

const User = {
    getAll: async () => {
        try {
            return await db.query(`SELECT * FROM ${nombreTabla}`);
        } catch (error) {
            console.log(error);
            throw Error('Error al obtener todos los usuarios');
        }
    },
    create: async (user) => {
        try {
            return await db.query(`INSERT INTO ${nombreTabla} SET ?`, user);
        } catch (error) {
            console.log(error);
            throw new Error('CREATE Error al crear el usuario');
        }
    },

    //getByUsername
    getByUsername: async (username) => {
        try {
            console.log('Datos recibidos en el modelo:', { username });
            const sql = `SELECT username FROM ${nombreTabla} WHERE username = ?`;
            //const [result] = await db.query(sql, [username]); // Destructuring para obtener solo el resultado
            return await db.query(sql, [username]);; 
        } catch (error) {
            console.log(error);
            throw new Error('Error al buscar usuario');
        }
    },
    
    
    

    registro: async ({ username,  password }) => {
        console.log('Datos recibidos en el modelo:', { username, password });

        try {
            const sql = `INSERT INTO ${nombreTabla} (username, password) VALUES (?, ?)`;
            const hashed_password = password;//await bcrypt.hash(password, salt_rounds);
            return await db.query(sql, [username,  hashed_password]);
        } catch (error) {
            console.log(error);
            throw new Error('registro Error al crear el usuario');
        }
    },
    delete: async (id) => {
        try {
            return await db.query(`DELETE FROM ${nombreTabla} WHERE id = ?`, [id]);
        } catch (error) {
            console.log(error);
            throw new Error('Error al eliminar el usuario');
        }
    }
};
module.exports = User;