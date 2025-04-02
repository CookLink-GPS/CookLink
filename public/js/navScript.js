document.addEventListener("DOMContentLoaded", () => {
	const navbarBrand = document.querySelector(".navbar-brand");

	if (window.location.pathname === "/" || window.location.pathname === "/users/registro" || window.location.pathname === "/users/login") navbarBrand.href = "/";
	else navbarBrand.href = "/inicio";

});
