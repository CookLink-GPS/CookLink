// Lógica para filtrar la lista de ingredientes
const searchInput = document.getElementById("searchInput");
const ingredientList = document.getElementById("ingredientList");
const ingredients = Array.from(ingredientList.getElementsByClassName("ingredient-item"));

searchInput.addEventListener("input", () => {
	const filter = searchInput.value.toLowerCase();

	ingredients.forEach(item => {
		const text = item.textContent.toLowerCase();
		item.style.display = text.includes(filter) ? "" : "none";
	});
});
