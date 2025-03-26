const { badRequest } = require("../config/httpcodes");
const AppError = require("../utils/AppError");
const Ingredient = require("../models/ingredientModel");
const Pantry = require("../models/pantryModel");
const { normalizarUnidad } = require("../utils/normalizarUnidad");

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
	processIngredient: async ({ nombre, tipoUnidad, cantidad, userId }) => {
		try {
			console.log(`[Service] Procesando ingrediente:`, { nombre, tipoUnidad, cantidad, userId });

			const unidadNormalizada = normalizarUnidad(tipoUnidad);
			// 1. Buscar  el ingrediente
			const ingredienteExistente = await Ingredient.findByName(nombre);
			let ingredientId;
			if (ingredienteExistente) {
				console.log(`[Service] Lectura ingrediente:`, ingredienteExistente);

				if (ingredienteExistente.tipoUnidad !== unidadNormalizada) throw new Error(`El tipo de unidad no coincide. Esperado: ${ingredienteExistente.tipoUnidad}, Recibido: ${tipoUnidad}`);

				ingredientId = ingredienteExistente.id;
			}
			else {
				// 2. Si no existe, crearlo
				console.log(`[Service] Ingrediente no encontrado`);
				ingredientId = await Ingredient.create(nombre, tipoUnidad);
				console.log(`[Service] Ingrediente creado con ID:`, ingredientId);
			}

			// 3. Verificar si ya está en la despensa
			const existsInPantry = await Pantry.findItem(userId, ingredientId);

			if (existsInPantry) {
				console.log(`[Service] Ingrediente ya en la despensa, actualizando cantidad... ID:`, existsInPantry.id_ingrediente);
				await Pantry.updateItem(userId, ingredientId, cantidad);

			}
			else {
				console.log(`[Service] Ingrediente no en despensa, añadiendo...`);
				await Pantry.addItem(userId, ingredientId, cantidad);

			}


			return {
				action: existsInPantry ? "updated" : "added",
				unidadNormalizada,
				cantidad,
				ingredienteExistente
			};

		}
		catch (error) {
			console.error("[Service] Error:", error);
			throw new AppError("Error al procesar el ingrediente", badRequest);
		}
	}


};


module.exports = IngredientService;
