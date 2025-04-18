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
		modalElement.style.display = "block";

		modalElement.addEventListener("click", event => {
			if (event.target === modalElement) modalElement.style.display = "none";

		});
	}
});
