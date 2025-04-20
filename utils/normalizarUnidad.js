// Utils.js
const normalizarUnidad = unidad => {
	const mapeoUnidades = {
		"g": "gramos",
		"kg": "kilogramos",
		"ml": "mililitros",
		"l": "litros",
		"ud": "unidades",
		"cda": "cucharadas",
		"cdta": "cucharaditas",
		"tz": "tazas"
	};
	return mapeoUnidades[unidad] || unidad;
};

module.exports = { normalizarUnidad };
