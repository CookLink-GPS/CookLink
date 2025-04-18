const Pantry = require("../models/pantryModel");
const Contains = require("../models/containsModel");
const AppError = require("../utils/AppError");
const { badRequest, internalServerError } = require("../config/httpcodes");

const cookService = {
	async cookRecipe({ userId, recipeId }) {
		if (!userId || !recipeId) throw new AppError("Faltan datos del usuario o receta", badRequest);


		try {
			// Obtener la despensa del usuario
			const pantry = await Pantry.getPantryFromUser(userId);
			const pantryMap = new Map(pantry.map(p => [ p.id_ingrediente, p.cantidad ]));

			// Obtener los ingredientes de la receta
			const ingredientes = await Contains.getIngredientsFromRecipe(recipeId);

			const faltantes = [];
			const suficientes = [];

			// Comparar lo que se necesita con lo que se tiene
			for (const { id, nombre, unidades } of ingredientes) {
				const disponibles = pantryMap.get(id) || 0;

				if (disponibles >= unidades) suficientes.push({ id, nombre, unidades });
				 else faltantes.push({ id, nombre, unidadesNecesarias: unidades - disponibles });

			}

			// Si faltan ingredientes
			if (faltantes.length > 0) return {
				success: false,
				message: "Faltan ingredientes para cocinar la receta",
				faltantes
			};


			// Si tiene todo → restar de la despensa
			for (const { id, unidades } of suficientes) await Pantry.decreaseQuantity(userId, id, unidades);


			return {
				success: true,
				message: "¡Receta cocinada con éxito!",
				usados: suficientes
			};
		}
		catch (error) {
			console.error("[cookService] Error al cocinar receta:", error);
			throw new AppError("Error interno al cocinar la receta", internalServerError);
		}
	}
};

module.exports = cookService;
