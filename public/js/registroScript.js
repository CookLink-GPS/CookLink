document.addEventListener("DOMContentLoaded", () => {
	"use strict";

	const forms = document.querySelectorAll(".needs-validation");

	Array.from(forms).forEach(form => {
		form.addEventListener("submit", event => {
			const mensajeError = {};

			if (!checkValidity(form, mensajeError)) {
				event.preventDefault();
				event.stopPropagation();
			}

			displayErrorMessages(mensajeError);

			if (Object.keys(mensajeError).length === 0) form.classList.add("was-validated");
			else form.classList.remove("was-validated");

		}, false);
	});

	const modalElement = document.getElementById("exitoModal");
	if (modalElement) {
		modalElement.style.display = "none";

		modalElement.addEventListener("click", event => {
			if (event.target === modalElement) modalElement.style.display = "none";
		});
	}

	const errormodalElement = document.getElementById("errorModal");
	if (errormodalElement) {
		errormodalElement.style.display = "block";

		errormodalElement.addEventListener("click", event => {
			if (event.target === errormodalElement) errormodalElement.style.display = "none";
		});
	}
});


function checkValidity(form, mensajeError) {
	let isValid = true;

	const inputs = form.querySelectorAll("input, select, textarea");
	inputs.forEach(input => {
		if (input.name === "username") {
			const usernameValue = input.value;

			if (usernameValue === "") {
				isValid = false;
				input.classList.remove("is-valid");
				input.classList.add("is-invalid");
				mensajeError.username = "El nombre de usuario es obligatorio";
			}
			else {
				input.classList.remove("is-invalid");
				input.classList.add("is-valid");
				mensajeError.password = "";
			}
		}
		if (input.name === "password") {
			const passwordValue = input.value;
			const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&'*+-/=.?^_{|}@(),:;<>@[])/;

			if (!regex.test(passwordValue)) {
				isValid = false;
				input.classList.remove("is-valid");
				input.classList.add("is-invalid");
				mensajeError.password = "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial";
			}
			else if (passwordValue.length < 8) {
				isValid = false;
				input.classList.remove("is-valid");
				input.classList.add("is-invalid");
				mensajeError.password = "La longitud mínima de la contraseña debe ser 8 caracteres";
			}
			else if (passwordValue.length > 50) {
				isValid = false;
				input.classList.remove("is-valid");
				input.classList.add("is-invalid");
				mensajeError.password = "La longitud máxima de la contraseña es de 50 caracteres";
			}
			else {
				input.classList.remove("is-invalid");
				input.classList.add("is-valid");
				mensajeError.password = "";
			}
		}

		if (input.name === "confirm_password") {
			const password = form.querySelector("input[name='password']").value;
			const confirmPasswordValue = input.value;

			if (confirmPasswordValue !== password) {
				isValid = false;
				input.classList.add("is-invalid");
				mensajeError.confirm_password = "Las contraseñas no son iguales";
			}
			else {
				input.classList.remove("is-invalid");
				input.classList.add("is-valid");
				mensajeError.confirm_password = "";
			}
		}

		if (input.hasAttribute("required") && !input.value.trim()) {
			isValid = false;
			input.classList.add("is-invalid");
			mensajeError[input.name] = "Este campo es obligatorio";
		}
		else input.classList.remove("is-invalid");

	});

	return isValid;
}

function displayErrorMessages(mensajeError) {
	for (const field in mensajeError) {
		const errorElement = document.querySelector(`#${field} + .invalid-feedback`);
		if (errorElement) {
			errorElement.textContent = mensajeError[field];
			errorElement.style.display = "block";
		}
	}
}
