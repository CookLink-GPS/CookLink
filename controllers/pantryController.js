const PantryService = require("../services/pantryService");
const { badRequest, internalServerError } = require("../config/httpcodes");
const AppError = require("../utils/AppError");
const { ok } = require("../config/httpcodes");
const { renderView } = require("../middlewares/viewHelper");

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
		const ERROR = 500;
		try {
			const userId = req.session.user.id;
			const id_despensa = req.params.id_despensa;
			const quantityToDelete = parseInt(req.body.quantity);

			if (!userId || !id_despensa || isNaN(quantityToDelete)) throw new AppError("Missing required data", badRequest);


			await PantryService.deleteIngredient(userId, id_despensa, quantityToDelete);
			res.redirect("/pantry");
		}
		catch (error) {
			console.error(error);
			res.status(error.status || ERROR).render("error", { message: error.message || "Error deleting ingredient" });
		}
	}
};

/**
 * Renderiza una vista con todos los ingredientes de la despensa del usuario
 *
 * @param {HTTPRequest} req
 * @param {HTTPResponse} res
 */
exports.getDespensa = async (req, res) => {
	const ingredients = await PantryService.getIngredientsDetails(req.session.user.id);
	renderView(res, "despensa", ok, { ingredients });
};

module.exports = pantryController;
