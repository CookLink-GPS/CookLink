module.exports = (req, res, next) => {
	// C req.session ||= {};
	// C req.session.user = { id: 1, username: "dummy" };
	next();
};
