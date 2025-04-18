const { ok, badRequest } = require("../config/httpcodes");
const cookService = require("../services/cookService");

exports.cookRecipe = async (req, res) => {
	const userId = req.session.user.id;
	const recipeId = req.params.id;

	try {
		const result = await cookService.cookRecipe({ userId, recipeId });

		res.status(ok).json(result); // Devuelve los ingredientes usados o los que faltan
	}
	catch (error) {
		res.status(badRequest).json({ error: error.message });
	}
};
