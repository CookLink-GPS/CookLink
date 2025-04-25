document.addEventListener("DOMContentLoaded", () => {
	const navbarBrand = document.querySelector(".navbar-brand");
	const path = window.location.pathname;

	const loginLink = document.getElementById("loginLink");
	const registerLink = document.getElementById("registerLink");
	const pantryLink = document.getElementById("pantryLink");
	const recommendationsLink = document.getElementById("recommendationsLink");
	const shoppingListLink = document.getElementById("shoppingListLink");

	if (path === "/" || path === "/usuarios/inicio" || path === "/usuarios/registro") {
		navbarBrand.href = "/";
		loginLink.style.display = "block";
		registerLink.style.display = "block";
		pantryLink.style.display = "none";
		recommendationsLink.style.display = "none";
		shoppingListLink.style.display = "none";
	}
	else {
		navbarBrand.href = "/inicio";
		loginLink.style.display = "none";
		registerLink.style.display = "none";
		pantryLink.style.display = "block";
		recommendationsLink.style.display = "block";
		shoppingListLink.style.display = "block";
	}
});
