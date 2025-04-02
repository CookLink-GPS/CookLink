module.exports = {
	port: parseInt(process.env.PORT, 10),
	baseUrl: process.env.BASE_URL,
	saltRounds: parseInt(process.env.SALT_ROUNDS, 10),
	secret: process.env.SESSION_SECRET
};
