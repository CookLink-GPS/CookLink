const { unauthorized } = require("../config/httpcodes");
const { renderView } = require("./viewHelper");

const authMiddleware = (req, res, next) => {
	if (!req.session.user) return renderView(res, "unauthorized", unauthorized);
	next();
};

module.exports = { authMiddleware };
