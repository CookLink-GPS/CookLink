document.addEventListener("DOMContentLoaded", () => {
	const checkboxes = document.querySelectorAll(".checkbox-compra");
	const modal = document.getElementById("buyIngredientModal");
	const modalText = document.getElementById("buyModalText");
	const form = document.getElementById("buyForm");

	checkboxes.forEach(checkbox => {
		checkbox.addEventListener("change", function () {
			if (this.checked) {
				const nombre = this.dataset.nombre;
				const cantidad = this.dataset.cantidad;
				const unidad = this.dataset.unidad;
				const id = this.id;

				modalText.textContent = `¿Quieres comprar "${nombre}" (${cantidad} ${unidad})?`;
				form.action = `/lista-compra/comprado/${id}`;
				modal.style.display = "block";

				const cancelBtn = modal.querySelector(".btn-secondary");
				cancelBtn.addEventListener("click", () => {
					this.checked = false;
				}, { once: true });
			}
		});
	});
});

// Mostrar el modal personalizado
const modalElement = document.getElementById("exitoModal");
if (modalElement) {
	modalElement.style.display = "block";

	modalElement.addEventListener("click", event => {
		if (event.target === modalElement) modalElement.style.display = "none";

	});
}
