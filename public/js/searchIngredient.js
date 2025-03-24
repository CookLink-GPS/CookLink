// Lógica para filtrar la lista de ingredientes
const searchInput = document.getElementById("searchInput");
const ingredientList = document.getElementById("ingredientList");
const ingredients = Array.from(ingredientList.getElementsByClassName("ingredient-item"));
const MIN_FILTER_LENGTH = 0;
const ZERO = 0;
let changed = false;
const ms = 100;

const removeAccents = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
	.trim();

const addDelay = (func, delay) => {
	if (!changed) {
		changed = true;
		setTimeout(() => changed = false, delay);
		return func();
	}
};

const filterList = (filter, list) => {
	const normalizedFilter = removeAccents(filter.toLowerCase());

	if (normalizedFilter.length === ZERO) list.forEach(item => item.style.display = "");
	else if (normalizedFilter.length < MIN_FILTER_LENGTH) list.forEach(item => item.style.display = "none");
	else list.forEach(item => {
		const text = removeAccents(item.textContent.toLowerCase());
		item.style.display = text.startsWith(normalizedFilter) ? "" : "none";
	});
};

searchInput.addEventListener("input", () => addDelay(() => filterList(searchInput.value, ingredients), ms));

