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


	// Mostrar el modal personalizado
	const modalElement = document.getElementById("exitoModal");
	if (modalElement) {
		// Mostrar el modal cambiando su propiedad 'display' a 'block'
		modalElement.style.display = "block";

		// Opcionalmente, puedes agregar un evento de clic fuera del modal para cerrarlo
		modalElement.addEventListener("click", event => {
			if (event.target === modalElement) modalElement.style.display = "none";

		});
	}
});
