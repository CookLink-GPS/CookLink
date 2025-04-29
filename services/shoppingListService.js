const ShoppingList = require("../models/shoppingListModel");
const PantryService = require("../services/pantryService");
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
	},
	/**
	 * Añade a la lista de la compra los ingredientes que faltan
	 *
	 * @param {Number} userId - ID del usuario
	 * @returns {Promise<Object>} - Ingredientes añadidos a la lista
	 */
	async addMissingToShoppingList(userId, faltantes) {
		if (!userId) throw new AppError("Faltan datos del usuario", badRequest);

		try {

			for (const { id, unidadesNecesarias, tipoUnidad } of faltantes) {
				const existe = await ShoppingList.getItem(userId, id);
				if (existe) {
					const cantidad = parseFloat(existe.cantidad + unidadesNecesarias);
					await ShoppingList.updateQuantity( existe.id_lista_compra, cantidad);
				}
				else await ShoppingList.addItem(userId, id, unidadesNecesarias, tipoUnidad);
			}


			return {
				success: true,
				message: "Ingredientes añadidos a tu lista de la compra",
				faltantes
			};
		}
		catch (error) {
			console.error("[ShoppingListService] Error en addMissingToShoppingList:", error);
			throw new AppError("Error al añadir ingredientes a la lista de la compra", internalServerError);
		}
	},


	/**
   * Recupera la lista de compra de un usuario.
   * CL_012_01 y CL_012_02.
   */
	async getList(userId) {
		// Fase previa de comprobración de la ausencia de datos
		if (!userId) throw new AppError("Se requiere el ID del usuario", badRequest);

		try {
		  const items = await ShoppingList.getItems(userId);
		  return items;
		}
		catch (err) {
		  throw new AppError(err, badRequest);
		}
	  },

	/**	CL_015_01
		 * Marca un ítem de la lista como comprado:
		 * 1) lo añade/actualiza en la despensa
		 * 2) lo borra de la lista de compra
	*/
	async markAsBought(userId, listId) {
		// Fase previa de comprobración de la ausencia de datos
		if (!userId || !listId) throw new AppError("Faltan datos para marcar como comprado", badRequest);

		// 1) Recuperar el item para conocer ingrediente y cantidad
		const item = await ShoppingList.getById(listId);
		if (!item || item.id_usuario !== userId) throw new AppError("Ítem no encontrado en la lista de compra", badRequest);

		// 2) Delegamos la inserción/actualización en la despensa
		//    PantryService.addIngredient ya comprueba existencia y suma cantidades
		await PantryService.addIngredient(userId, item.id_ingrediente, item.cantidad);

		// 3) Eliminamos de la lista de la compra
		await ShoppingList.deleteItem(listId);

		return { ingredientId: item.id_ingrediente, quantity: item.cantidad };
	}
};

module.exports = ShoppingListService;
