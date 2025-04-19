const ShoppingList = require("../models/shoppingListModel");
const Ingredient = require("../models/ingredientModel");
const AppError = require("../utils/AppError");
const { badRequest, internalServerError } = require("../config/httpcodes");

const ShoppingListService = {
	/**
   * Añade un ingrediente manualmente.
   * Valida los CA desde CL_011_02 hasta CL_011_06.
   */
	async addIngredient(userId, name, quantity, unit, validUnits) {
		// CL_011_03: todos los campos
		if (!userId || !name || quantity === null || !unit) throw new AppError("Hay que rellenar todos los campos.", badRequest);

		// CL_011_04: cantidad numérica > 0
		const q = parseFloat(quantity);
		if (isNaN(q) || q <= 0) throw new AppError("La cantidad introducida no es válida.", badRequest);

		// CL_011_05: unidad válida
		if (!validUnits.includes(unit)) throw new AppError("La tipo de unidad no es valido.", badRequest);

		try {
			// Debe existir en tabla ingredientes
			const ingredient = await Ingredient.findByName(name);
			if (!ingredient) throw new AppError("El ingrediente no existe.", badRequest);

			const ingredientId = ingredient.id;

			// CL_011_06: si ya existe, sumar; si no, insertar
			const existing = await ShoppingList.getItem(userId, ingredientId);
			if (existing) {
				const newQty = parseFloat(existing.cantidad) + q;
				await ShoppingList.updateQuantity(existing.id_lista_compra, newQty);
			}
			else await ShoppingList.addItem(userId, ingredientId, q, unit);

		}
		catch (err) {
			if (err.isAppError) throw err;
			throw new AppError("Error al añadir el ingrediente.", internalServerError);
		}
	}
};

module.exports = ShoppingListService;
