// Routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { check } = require("express-validator");
const AppError = require("../utils/AppError");
const { badRequest } = require("../config/httpcodes");

// /users
router.get("/", userController.getAllUsers);
router.get("/login", userController.toLogin);
router.get("/registro", userController.toRegistro);

/**
 * Ruta para el registro de un usuario con validación de datos de contraseña.
 *
 * @param {Object} req - Objeto de solicitud HTTP que contiene los datos del formulario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} - Valida y registra al usuario si los datos son correctos.
 */
router.post(
	"/registro",
	check("password", "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&'*+-/=.?^_{|}@(),:;<>@[])/),
	check("password", "La longitud minima de la contraseña debe ser 8").isLength({ min: 8 }),
	check("password", "La longitud máxima de la contraseña es de 50 carácteres").isLength({ max: 50 }),
	check("confirm_password")
		.custom((value, { req }) => {
			if (value !== req.body.password) throw new AppError("Las contraseñas no son iguales", badRequest);

			return true;
		})
	, userController.registroUser
);


// /users/create
router.post("/create", userController.createUser);
router.post("/login", userController.inciarSesion);
router.delete("/delete/:id", userController.deleteUser);


module.exports = router;
