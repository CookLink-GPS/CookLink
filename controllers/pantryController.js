const PantryService = require("../services/pantryService");
const { badRequest, internalServerError, forbidden } = require("../config/httpcodes");
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
		console.log(req.session);
		try {
			const ingredients = await PantryService.getIngredientsDetails(req.session.user.id);
			renderView(res, "pantry", ok, { ingredients });
		}
		catch (error) {
			console.error(error.message);
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

			await PantryService.deleteIngredient(userId, pantryId, quantityToDelete);
			res.redirect("/pantry");
		}
		catch (error) {
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
			if (!req.session.user.id) throw new AppError("Usuario no autenticado", forbidden);
			const ingredientes = await PantryService.searchIngredients(req.params.filter || "", req.session.user.id);

			res.json({ ingredientes });
		}
		catch (err) {
			console.error(err.message);
			if (err.status === forbidden) res.status(forbidden).json({ mensajeError: err.message });
			else res.status(badRequest).json({ mensajeError: "Error al filtrar los ingredientes" });
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
