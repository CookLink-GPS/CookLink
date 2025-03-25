const PantryService = require("../services/pantryService");
const { badRequest, internalServerError } = require("../config/httpcodes");
const AppError = require("../utils/AppError");

const pantryController = {
	/**
     * Displays the user's pantry.
     *
     * @param {Object} req - HTTP request object.
     * @param {Object} res - HTTP response object.
     */
	async showPantry(req, res) {
		try {
			const userId = req.session.user.id;
			const ingredients = await PantryService.getPantryIngredients(userId);
			res.render("pantry", { ingredients });
		}
		catch (error) {
			console.error(error);
			res.status(internalServerError).render("error", { message: "Error fetching pantry" });
		}
	},

	/**
     * Deletes an ingredient from the user's pantry.
     *
     * @param {Object} req - HTTP request object.
     * @param {Object} res - HTTP response object.
     */
	async deleteIngredient(req, res) {
		try {
			const userId = req.session.user.id;
			const ingredientId = req.params.ingredientId;
			const quantityToDelete = parseInt(req.body.quantity);

			if (!userId || !ingredientId || isNaN(quantityToDelete)) throw new AppError("Missing required data", badRequest);


			await PantryService.deleteIngredient(userId, ingredientId, quantityToDelete);
			res.redirect("/pantry");
		}
		catch (error) {
			console.error(error);
			res.status(internalServerError).render("error", { message: "Error deleting ingredient" });
		}
	}
};

module.exports = pantryController;
