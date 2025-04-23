const { badRequest } = require("../config/httpcodes");
const AppError = require("../utils/AppError");
const Ingredient = require("../models/ingredientModel");
const { removeAccents } = require("../utils/stringFunctions");
const Pantry = require("../models/pantryModel");


const IngredientService = {

	/**
     * Procesa el ingrediente para la despensa
     * @param {Object} data - Datos del ingrediente
     * @param {string} data.nombre - Nombre del ingrediente
     * @param {string} data.tipoUnidad - Tipo de unidad
     * @param {number} data.cantidad - Cantidad a añadir
     * @param {number} data.userId - ID del usuario
     * @returns {Promise<Object>} - Resultado de la operación
     */
	async processIngredient({ ingrediente, cantidad, userId }) {
		try {
			console.log("Procesando ingrediente:", ingrediente, cantidad, userId);
			// La cantidad es obligatoria y debe ser mayor que 0
			if (!cantidad || cantidad < 0) throw new AppError("La cantidad debe ser mayor que 0", badRequest);
			// Validar que el nombre del ingrediente solo contenga letras
			const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
			if (!soloLetras.test(ingrediente.nombre)) throw new AppError("El nombre del ingrediente solo puede contener letras y espacios", badRequest);

			// 1. Buscar el ingrediente en la tabla ingrediente
			const ingredienteExistente = await Ingredient.findByName(ingrediente.nombre);
			console.log("Ingrediente existente:", ingredienteExistente);

			if (cantidad <= 0) throw new AppError("La cantidad debe ser mayor que 0", badRequest);
			if (cantidad > 100000) throw new AppError("La cantidad no puede ser mayor que 100.000", badRequest);

			let ingredientId;
			let existsInPantry;
			let action = "";
			if (ingredienteExistente) {
				if (ingredienteExistente.tipoUnidad.trim().toLowerCase() !== ingrediente.tipoUnidad.trim().toLowerCase()) throw new AppError(`El tipo de unidad no coincide. Esperado: ${ingredienteExistente.tipoUnidad}`, badRequest);
				ingredientId = ingredienteExistente.id;

				// 3. Verificar si ya está en la despensa
				existsInPantry = await Pantry.getPantryItemByIngredient(userId, ingredientId);

				if (existsInPantry) {
					const cantidadActual = existsInPantry.cantidad;
					cantidad = cantidadActual + cantidad;
					await Pantry.updateIngredientQuantity(userId, ingredientId, cantidad);
					action = "updated";
					return {
						action,
						ingrediente,
						cantidad
					};
				}
				// 4. Si no está en la despensa, añadirlo
				await Pantry.addIngredient(userId, ingredientId, cantidad);
				action = "added";
				return {
					action,
					ingrediente,
					cantidad
				};
			}

			// 2. Si no existe en la tabla ingrediente, crearlo
			ingredientId = await Ingredient.create(ingrediente.nombre, ingrediente.tipoUnidad);
			await Pantry.addIngredient(userId, ingredientId, cantidad);
			action = "added";
			return {
				action,
				ingrediente,
				cantidad
			};
		}
		catch (error) {
			console.error(error.message);
			throw new AppError(error, badRequest);
		}
	},

	async filterIngredients(filter) {
		if (filter === undefined || filter === null) filter = "";

		const ingredients = await Ingredient.getAllIngredients();
		const normalizedFilter = removeAccents(filter.toLowerCase());

		const res = ingredients.filter(item => {
			const text = removeAccents(item.nombre.toLowerCase());
			return text.startsWith(normalizedFilter);
		});

		return res;
	},

	async getAllIngredientsFromDatabase() {
		const ingredients = await Ingredient.getAllIngredients();

		return ingredients;
	},

	async getIngredientsFromUserPantry(userId) {
		try {
			const userIngredients = await Pantry.getPantryFromUser(userId);
			return userIngredients;
		}
		catch (error) {
			console.error("Error usuario:", error);
			throw error;
		}
	},

	async addIngredientToPantry(userId, ingredientId, quantity) {
		try {
			const existsInPantry = await Pantry.getPantryItemByIngredient(userId, ingredientId);
			// Console.log("Cantidad actual", existsInPantry.cantidad);
			if (existsInPantry) {
				const cantidadActual = existsInPantry.cantidad;
				quantity = cantidadActual + quantity;
				console.log("Nueva cantidad", quantity);
				await Pantry.updateIngredientQuantity(userId, ingredientId, quantity);
			}
			else await Pantry.addIngredient(userId, ingredientId, quantity);
		}
		catch (error) {
			console.error("Error al añadir el ingrediente a la despensa:", error);
			throw error;
		}
	}
};

module.exports = IngredientService;
