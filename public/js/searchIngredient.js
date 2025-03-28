// Lógica para filtrar la lista de ingredientes
const searchInput = document.getElementById("searchInput");
const ingredientList = document.getElementById("ingredientList");

let prevSearch = "";
const MIN_FILTER_LENGTH = 2;

const searchIngredients = async search => {
	const { ingredientes } = await fetch(`/despensa/search/${search}`, { method: "GET" }).then(res => res.json());

	ingredientes.forEach(({ nombre }) => {
		const li = document.createElement("li");
		li.classList.add("ingredient-item");
		li.classList.add("text-white");
		li.classList.add("rounded");
		li.textContent = nombre;
		ingredientList.appendChild(li);
	});
};

searchIngredients("");

searchInput.addEventListener("input", async () => {
	let search = searchInput.value;
	if (searchInput.value.length < MIN_FILTER_LENGTH) search = "";

	if (search === prevSearch) return;
	prevSearch = search;

	ingredientList.innerHTML = "";

	await searchIngredients(search);
});

