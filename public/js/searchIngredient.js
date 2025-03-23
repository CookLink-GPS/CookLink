// Lógica para filtrar la lista de ingredientes
const searchInput = document.getElementById("searchInput");
const ingredientList = document.getElementById("ingredientList");
const ingredients = Array.from(ingredientList.getElementsByClassName("ingredient-item"));


const removeAccents = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

searchInput.addEventListener("input", () => {
	const filter = removeAccents(searchInput.value.toLowerCase());

	ingredients.forEach(item => {
		const text = removeAccents(item.textContent.toLowerCase());
		item.style.display = text.includes(filter) ? "" : "none";
	});
});
