document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".recipe-card").forEach(card => {
		card.addEventListener("click", function () {
			const recipeId = this.getAttribute("data-id");
			if (recipeId) window.location.href = `/recetas/${recipeId}`;

		});
	});
});
