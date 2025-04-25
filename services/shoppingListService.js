const ShoppingList = require("../models/shoppingListModel");
const Ingredient = require("../models/ingredientModel");
const AppError = require("../utils/AppError");
const { badRequest } = require("../config/httpcodes");

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
		if (isNaN(q)) throw new AppError("La cantidad introducida no es válida.", badRequest);
		if (q <= 0) throw new AppError("La cantidad debe ser mayor que 0", badRequest);
		if (q > 100000) throw new AppError("La cantidad no puede ser mayor que 100.000", badRequest);

		// CL_011_05: unidad válida
		if (!validUnits.includes(unit)) throw new AppError("El tipo de unidad no es valido.", badRequest);
		try {
			// Debe existir en tabla ingredientes
			let ingredient = await Ingredient.findByName(name);
			if (!ingredient) {
				// Si no existe, lo damos de alta en la tabla ingredientes
				const newIngredientId = await Ingredient.create(name, unit);
				ingredient = { id: newIngredientId, tipoUnidad: unit };
			}

			const ingredientId = ingredient.id;
			if (ingredient.tipoUnidad.trim().toLowerCase() !== unit.trim().toLowerCase()) throw new AppError(`El tipo de unidad no coincide. Esperado: ${ingredient.tipoUnidad}`, badRequest);

			// CL_011_06: si ya existe, sumar; si no, insertar
			const existing = await ShoppingList.getItem(userId, ingredientId);
			if (existing) {
				const newQty = parseFloat(existing.cantidad) + q;
				await ShoppingList.updateQuantity(existing.id_lista_compra, newQty);
				return {
					action: "updated",
					ingredientId,
					q: newQty
				};
			}

			await ShoppingList.addItem(userId, ingredientId, q, unit);
			return {
				action: "added",
				ingredientId,
				q
			};


		}
		catch (err) {
			throw new AppError(err, badRequest);
		}
	}
};

module.exports = ShoppingListService;
