document.addEventListener("DOMContentLoaded", () => {
	"use strict";
	const forms = document.querySelectorAll(".needs-validation");

	Array.from(forms).forEach(form => {
		form.addEventListener("submit", event => {
			if (!form.checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
			}

			form.classList.add("was-validated");
		}, false);
	});

	const selectIngredientes = document.getElementById("ingredientes");
	const inputTipoUnidad = document.getElementById("tipoUnidad");

	selectIngredientes.addEventListener("change", () => {
		const selectedOption = selectIngredientes.options[selectIngredientes.selectedIndex];
		const tipoUnidad = selectedOption.getAttribute("data-tipo");
		inputTipoUnidad.value = tipoUnidad || "";
	});

	// Mostrar el modal personalizado
	const modalElement = document.getElementById("exitoModal");
	if (modalElement) {
		modalElement.style.display = "block";

		modalElement.addEventListener("click", event => {
			if (event.target === modalElement) modalElement.style.display = "none";

		});
	}
});
