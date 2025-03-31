/* eslint-disable no-magic-numbers */
const { badRequest, conflict } = require("../config/httpcodes");
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
	processIngredient: async ({ ingrediente, cantidad, userId }) => {
		try {
			console.log(`[Service] Procesando ingrediente:`, { ingrediente, cantidad, userId });

			// Comprobaciones de entrada
			if (cantidad === undefined || cantidad === null || cantidad <= 0) throw new AppError("La cantidad debe ser mayor que 0", badRequest);

			// 1. Buscar el ingrediente en la tabla ingrediente
			const ingredienteExistente = await Ingredient.findByName(ingrediente.nombre);
			let ingredientId;
			let existsInPantry;
			let action = "";
			if (ingredienteExistente) {
				console.log(`[Service] Lectura ingrediente:`, ingredienteExistente);
				console.log(`Esperado: '${ingredienteExistente.tipoUnidad}'`);
				if (ingredienteExistente.tipoUnidad.trim().toLowerCase() !== ingrediente.tipoUnidad.trim().toLowerCase()) throw new AppError(`El tipo de unidad no coincide. Esperado: ${ingredienteExistente.tipoUnidad}, Recibido: ${ingrediente.tipoUnidad}`, badRequest);

				ingredientId = ingredienteExistente.id;

				// 3. Verificar si ya está en la despensa
				existsInPantry = await Pantry.findItem(userId, ingredientId);

				if (existsInPantry) {
					console.log(`[Service] Ingrediente ya en la despensa, actualizando cantidad... ID:`, existsInPantry.id_ingrediente);
					await Pantry.updateItem(userId, ingredientId, cantidad);
					action = "updated";
					return {
						action,
						ingrediente,
						cantidad
					};
				}

				console.log(`[Service] Ingrediente no en despensa, añadiendo...`);
				await Pantry.addItem(userId, ingredientId, cantidad);
				action = "added";
				return {
					action,
					ingrediente,
					cantidad
				};
			}

			// 2. Si no existe, crearlo
			console.log(`[Service] Ingrediente no encontrado`);
			ingredientId = await Ingredient.create(ingrediente.nombre, ingrediente.tipoUnidad);
			console.log(`[Service] Ingrediente creado con ID:`, ingredientId);
			console.log(`[Service] Ingrediente no en despensa, añadiendo...`);
			await Pantry.addItem(userId, ingredientId, cantidad);
			action = "added";
			return {
				action,
				ingrediente,
				cantidad
			};
		}
		catch (error) {
			console.error("[Service] Error:", error);
			throw new AppError(error, badRequest);
		}
	},

	filterIngredients: async filter => {
		if (filter === undefined || filter === null) filter = "";

		const ingredients = await Ingredient.getAllIngredients();
		const normalizedFilter = removeAccents(filter.toLowerCase());

		const res = ingredients.filter(item => {
			const text = removeAccents(item.nombre.toLowerCase());
			return text.startsWith(normalizedFilter);
		});

		return res;
	}

};


module.exports = IngredientService;
