// Mostrar el modal de éxito
const exitoModal = document.getElementById("exitoModal");
if (exitoModal) {
	exitoModal.style.display = "block";
	exitoModal.addEventListener("click", event => {
		if (event.target === exitoModal) exitoModal.style.display = "none";

	});
}

// Mostrar el modal de error
const errorModal = document.getElementById("errorModal");
if (errorModal) errorModal.style.display = "block";

