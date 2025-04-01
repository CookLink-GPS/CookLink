document.addEventListener("DOMContentLoaded", () => {
	const navbarBrand = document.querySelector(".navbar-brand");

	if (window.location.pathname === "/" || window.location.pathname === "/users/registro") navbarBrand.href = "/";
	else navbarBrand.href = "/inicio";

});
