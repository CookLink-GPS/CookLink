const PantryService = require("../services/pantryService");
const { badRequest, internalServerError } = require("../config/httpcodes");
const AppError = require("../utils/AppError");
const { ok } = require("../config/httpcodes");
const { renderView } = require("../middlewares/viewHelper");

const PantryController = {
	/**
     * Displays the user's pantry.
     *
     * @param {Request} req - HTTP request object.
     * @param {Response} res - HTTP response object.
     */
	async showPantry(req, res) {
		try {
			const userId = req.session.user.id;
			const ingredients = await PantryService.getPantryIngredients(userId);
			res.render("pantry", { ingredients });
		}
		catch (error) {
			console.error(error);
			renderView(res, "error", internalServerError, { error: "Error fetching pantry", status: internalServerError });
		}
	},

	/**
     * Deletes an ingredient from the user's pantry.
     *
     * @param {Request} req - HTTP request object.
     * @param {Response} res - HTTP response object.
     */
	async deleteIngredient(req, res) {
		try {
			const userId = req.session.user.id;
			const pantryId = req.params.id_despensa;
			const quantityToDelete = parseInt(req.body.quantity, 10);

			if (!userId || !pantryId || isNaN(quantityToDelete)) throw new AppError("Missing required data", badRequest);


			await PantryService.deleteIngredient(userId, pantryId, quantityToDelete);
			res.redirect("/pantry");
		}
		catch (error) {
			console.error(error);
			renderView(res, "error", error.status || badRequest, { message: error.message || "Error deleting ingredient" });
		}
	},
	/**
	 * Devuelve una lista con los ingredientes a buscar
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async searchIngredients(req, res) {
		try {
			const ingredientes = await PantryService.searchIngredients(req.params.filter || "", req.session.user.id);

			res.json({ ingredientes });
		}
		catch (err) {
			console.error(err.message);
			res.json({ mensajeError: "Error al filtrar los ingredientes" });
		}
	},
	/**
	 * Renderiza una vista con todos los ingredientes de la despensa del usuario
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async getDespensa(req, res) {
		const ingredients = await PantryService.getIngredientsDetails(req.session.user.id);
		renderView(res, "despensa", ok, { ingredients });
	}
};

module.exports = PantryController;
