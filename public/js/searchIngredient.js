// Lógica para filtrar la lista de ingredientes
const searchInput = document.getElementById("searchInput");
const ingredientList = document.getElementById("ingredientList");
const ingredients = Array.from(ingredientList.getElementsByClassName("ingredient-item"));
const MIN_FILTER_LENGTH = 2;
const ZERO = 0;

const removeAccents = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const filterIngredients = (input, ingredientsList, filterFunc) => {
	const filter = filterFunc(input);
	if (filter.length === ZERO) ingredientsList.forEach(item => item.style.display = "");
	else if (filter.length < MIN_FILTER_LENGTH) ingredientsList.forEach(item => item.style.display = "none");
	else ingredientsList.forEach(item => {
		const text = removeAccents(item.textContent.toLowerCase());
		item.style.display = text.includes(filter) ? "" : "none";
	});
};

searchInput.addEventListener("input", () => {
	filterIngredients(searchInput.value, ingredients, removeAccents);
});

