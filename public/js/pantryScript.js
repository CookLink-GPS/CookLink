const unidadMap = {
	"gramos": "g",
	"kilogramos": "kg",
	"mililitros": "ml",
	"litros": "l",
	"unidades": "ud",
	"cucharadas": "cda (cucharada)",
	"cucharaditas": "cdta (cucharadita)",
	"tazas": "tz (taza)"
};

document.addEventListener("DOMContentLoaded", () => {

	document.querySelectorAll("td.tipo-unidad").forEach(td => {
		const tipo = td.textContent.trim();
		if (unidadMap[tipo]) td.textContent = unidadMap[tipo];
	});

	const deleteModal = document.getElementById("confirmDeleteModal");

	deleteModal.addEventListener("show.bs.modal", event => {
		const button = event.relatedTarget;
		const idDespensa = button.getAttribute("data-despensa-id");
		const currentQuantity = button.getAttribute("data-ingredient-quantity");

		const quantityInput = document.getElementById("quantityToDelete");
		const maxQuantityHint = document.getElementById("maxQuantityHint");
		const deleteForm = document.getElementById("deleteForm");

		// Configurar el formulario
		deleteForm.action = `/pantry/delete/${idDespensa}`;
		quantityInput.min = 0.1;
		quantityInput.step = 0.1; // Permitir decimales
		quantityInput.max = parseFloat(currentQuantity);
		quantityInput.value = 1;
		maxQuantityHint.textContent = `Máximo: ${currentQuantity} unidades disponibles`;

		// Validación
		quantityInput.oninvalid = function () {
			this.setCustomValidity(`Por favor ingresa un valor entre 0,1 y ${currentQuantity}`);
		};
		quantityInput.oninput = function () {
			this.setCustomValidity("");
		};
	});

	// JavaScript para cambiar el paso en la cantidad
	const quantityInput = document.getElementById("quantityToDelete");
	quantityInput.addEventListener("input", () => {
		const currentQuantity = parseFloat(quantityInput.max);
		if (parseFloat(quantityInput.value) > currentQuantity) quantityInput.value = currentQuantity; // No puede superar la cantidad disponible

	});
});

// Lógica para filtrar la lista de ingredientes
const searchInput = document.getElementById("searchInput");
const ingredientList = document.getElementById("ingredientList");

let prevSearch = "";
const MIN_FILTER_LENGTH = 2;

const searchIngredients = async search => {
	ingredientList.innerHTML = "";
	const { ingredientes } = await fetch(`/pantry/search/${search}`, { method: "GET" }).then(res => res.json());

	ingredientes.forEach(({ nombre, cantidad, tipoUnidad }) => {
		const tr = document.createElement("tr");
		const nameTd = document.createElement("td");
		nameTd.textContent = nombre;
		const quantityTd = document.createElement("td");
		quantityTd.classList.add("ingredient-quantity");
		quantityTd.textContent = cantidad;
		const unitTd = document.createElement("td");
		unitTd.setAttribute("data-tipo", tipoUnidad);
		unitTd.classList.add("tipo-unidad");
		unitTd.textContent = tipoUnidad;

		tr.appendChild(nameTd);
		tr.appendChild(quantityTd);
		tr.appendChild(unitTd);

		ingredientList.appendChild(tr);

		document.querySelectorAll("td.tipo-unidad").forEach(td => {
			const tipo = td.textContent.trim();
			if (unidadMap[tipo]) td.textContent = unidadMap[tipo];
		});
	});

	if (!ingredientes.length) {
		const tr = document.createElement("tr");
		const td = document.createElement("td");
		td.setAttribute("colspan", "4");
		td.classList.add("text-center");
		td.classList.add("text-muted");
		td.textContent = "No tienes ingredientes en la despensa";
		tr.appendChild(td);

		ingredientList.appendChild(tr);
	}
};

searchIngredients("");

searchInput.addEventListener("input", async () => {
	let search = searchInput.value;
	if (searchInput.value.length < MIN_FILTER_LENGTH) search = "";

	if (search === prevSearch) return;
	prevSearch = search;

	await searchIngredients(search);
});

