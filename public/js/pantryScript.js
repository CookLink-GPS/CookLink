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

function debounce(func, delay) {
	let timer;
	return function (...args) {
	  clearTimeout(timer);
	  timer = setTimeout(() => func.apply(this, args), delay);
	};
}

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll("td.tipo-unidad").forEach(td => {
		const tipo = td.textContent.trim();
		if (unidadMap[tipo]) td.textContent = unidadMap[tipo];
	});
	toggleClearButton();
});

// Lógica para filtrar la lista de ingredientes
const searchInput = document.getElementById("searchInput");
const ingredientList = document.getElementById("ingredientList");
const clearButton = document.getElementById("clearSearch");

let prevSearch = "";
let lastEmptySearch = "";
let lastResult = [];
const MIN_FILTER_LENGTH = 2;

const configureButtonModal = (idDespensa, cantidad) => {
	const deleteButton = document.createElement("button");

	deleteButton.classList.add("btn", "btn-danger", "btn-sm");
	deleteButton.textContent = "Eliminar";

	deleteButton.setAttribute("data-bs-toggle", "modal");
	deleteButton.setAttribute("data-bs-target", "#confirmDeleteModal");
	deleteButton.setAttribute("data-despensa-id", idDespensa);
	deleteButton.setAttribute("data-ingredient-quantity", cantidad);

	const deleteModal = document.getElementById("confirmDeleteModal");

	deleteModal.addEventListener("show.bs.modal", event => {
		const button = event.relatedTarget;
		const pantryId = button.getAttribute("data-despensa-id");
		const currentQuantity = button.getAttribute("data-ingredient-quantity");

		const quantityInput = document.getElementById("quantityToDelete");
		const maxQuantityHint = document.getElementById("maxQuantityHint");
		const deleteForm = document.getElementById("deleteForm");

		// Configurar el formulario
		deleteForm.action = `/despensa/borrar/${pantryId}`;
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

	return deleteButton;
};

const createIngredientRow = ({ idDespensa, nombre, cantidad, tipoUnidad }) => {
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
	const deleteTd = document.createElement("td");

	deleteTd.appendChild(configureButtonModal(idDespensa, cantidad));

	tr.appendChild(nameTd);
	tr.appendChild(quantityTd);
	tr.appendChild(unitTd);
	tr.appendChild(deleteTd);

	return tr;
};

function renderEmptyMessage() {
	ingredientList.innerHTML = "";
	const tr = document.createElement("tr");
	const td = document.createElement("td");
	td.setAttribute("colspan", "4");
	td.classList.add("text-center", "text-muted");
	td.textContent = "No se han encontrado ingredientes en la despensa";
	tr.appendChild(td);
	ingredientList.appendChild(tr);
}

const searchIngredients = async search => {

	if (lastEmptySearch && search.startsWith(lastEmptySearch)) {
		renderEmptyMessage();
		return;
	}

	const { ingredientes } = await fetch(`/despensa/buscar/${search}`, { method: "GET" }).then(res => res.json());

	if (
		lastResult.length === ingredientes.length &&
		lastResult.every((ing, i) =>
			ing.idDespensa === ingredientes[i].idDespensa &&
			ing.nombre === ingredientes[i].nombre &&
			ing.cantidad === ingredientes[i].cantidad &&
			ing.tipoUnidad === ingredientes[i].tipoUnidad)
	) return;

	ingredientList.innerHTML = "";

	if (!ingredientes.length) {
		lastEmptySearch = search;
		lastResult = [];
		renderEmptyMessage();
		return;
	}

	lastEmptySearch = "";
	lastResult = ingredientes;

	ingredientes.forEach(ingredient => {
		ingredientList.appendChild(createIngredientRow(ingredient));
	});

};

searchIngredients("");

function toggleClearButton() {
	const hasText = searchInput.value.trim().length > 0;
	// eslint-disable-next-line no-undef
	clearIcon.style.visibility = hasText ? "visible" : "hidden";
	clearButton.disabled = !hasText;
}

clearButton.addEventListener("click", () => {
	searchInput.value = "";
	prevSearch = "";
	toggleClearButton();
	searchIngredients("");
});

searchInput.addEventListener("input", debounce(async () => {
	let search = searchInput.value;

	toggleClearButton();

	if (searchInput.value.length < MIN_FILTER_LENGTH) search = "";

	if (search === prevSearch) return;
	prevSearch = search;

	await searchIngredients(search);
}, 100));
