const { unauthorized } = require("../config/httpcodes");

const authMiddleware = (req, res, next) => {
	if (!req.session.user) return res.status(unauthorized).json({ error: "Acceso no autorizado" });
	next();
};

module.exports = { authMiddleware };
