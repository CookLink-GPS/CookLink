const { badRequest } = require("../config/httpcodes");
const AppError = require("../utils/AppError");
const Ingredient = require("../models/ingredientModel");
const { removeAccents } = require("../utils/stringFunctions");

const IngredientService = {


	/**
     * Registra un nuevo ingrediente después de validar los datos proporcionados.
     *
     * @param {Object} ingredient - Datos del ingrediente a registrar.
     * @param {string} ingredient.name - Nombre del ingrediente.
     * @returns {Promise<Object>} - Devuelve el resultado de la operación de registro.
     * @throws {AppError} - Lanza un error si los datos son inválidos o el ingrediente ya existe.
     */
	addIngredient: ingredient => {
		console.log("Ingrediente service");
		if (!ingredient.name) throw new AppError("Falta el nombre del ingrediente", badRequest);
		if (/[\s\t]/.test(ingredient.name)) throw new AppError("El nombre del ingrediente tiene espacios", badRequest);

		return Ingredient.add(ingredient);
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
