document.addEventListener("DOMContentLoaded", () => {
	const navbarBrand = document.querySelector(".navbar-brand");

	if (window.location.pathname === "/" || window.location.pathname === "/usuarios/registro" || window.location.pathname === "/usuarios/login") navbarBrand.href = "/";
	else navbarBrand.href = "/inicio";

});
