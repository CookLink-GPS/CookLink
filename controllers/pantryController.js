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
			console.error(error.message);
			renderView(res, "error", internalServerError, { error: "Error fetching pantry", status: internalServerError });
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
			const idDespensa = req.params.id_despensa;
			const quantityToDelete = parseFloat(req.body.quantity);

			if (!userId || !idDespensa || isNaN(quantityToDelete)) throw new AppError("Missing required data", badRequest);


			await PantryService.deleteIngredient(userId, idDespensa, quantityToDelete);
			res.redirect("/pantry");
		}
		catch (error) {
			console.error(error.message);
			res.status(error.status || ERROR).render("error", { message: error.message || "Error deleting ingredient" });
		}
	}
};

/**
 * Renderiza una vista con todos los ingredientes de la despensa del usuario
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getDespensa = async (req, res) => {
	const ingredients = await PantryService.getIngredientsDetails(req.session.user.id);
	renderView(res, "despensa", ok, { ingredients });
};

module.exports = pantryController;
/**
 * Devuelve una lista con los ingredientes a buscar
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.searchIngredients = async (req, res) => {
	try {
		const ingredientes = await pantryService.searchIngredients(req.params.filter || "", req.session.user.id);

		res.json({ ingredientes });
	}
	catch (err) {
		console.error(err.message);
		res.json({ mensajeError: "Error al filtrar los ingredientes" });
	}
};
