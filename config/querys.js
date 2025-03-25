module.exports.userQuerys = {
	getAllUsers: "SELECT id, username FROM usuarios ORDER BY id",
	getByUsername: "SELECT id, username FROM usuarios WHERE username = ?",
	insertUser: "INSERT INTO usuarios (username, password) VALUES (?, ?)",
	deleteUser: "DELETE FROM usuarios WHERE id = ?"
};
