module.exports = (req, res, next) => {
	req.session.user = { id: 1, username: "dummy" };
	next();
};
