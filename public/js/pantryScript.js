document.addEventListener("DOMContentLoaded", () => {

	const unidadMap = {
		"gramos": "Gramos (g)",
		"kilogramos": "Kilogramos (kg)",
		"mililitros": "Mililitros (ml)",
		"litros": "Litros (l)",
		"unidades": "Unidades (ud)",
		"cucharadas": "Cucharadas (cda)",
		"cucharaditas": "Cucharaditas (cdta)",
		"tazas": "Tazas (tz)"
	};

	document.querySelectorAll("td.tipo-unidad").forEach(td => {
		const tipo = td.textContent.trim(); // Obtener el contenido de la celda y eliminar espacios en blanco
		if (unidadMap[tipo]) td.textContent = unidadMap[tipo]; // Reemplazar por el formato correcto

	});

	const deleteModal = document.getElementById("confirmDeleteModal");

	deleteModal.addEventListener("show.bs.modal", event => {
		const button = event.relatedTarget;
		const id_despensa = button.getAttribute("data-despensa-id");
		const currentQuantity = button.getAttribute("data-ingredient-quantity");

		const quantityInput = document.getElementById("quantityToDelete");
		const maxQuantityHint = document.getElementById("maxQuantityHint");
		const deleteForm = document.getElementById("deleteForm");

		// Configurar el formulario
		deleteForm.action = `/pantry/delete/${id_despensa}`;
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
