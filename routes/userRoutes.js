const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { check } = require("express-validator");
const AppError = require("../utils/AppError");
const { badRequest } = require("../config/httpcodes");

router.get("/", userController.getAllUsers);
router.get("/registro", userController.toRegistro);
router.delete("/delete/:id", userController.deleteUser);
router.post(
	"/registro",
	// Check("password", "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial")
	// 	.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&'*+-/=.?^_{|}@(),:;<>@[])/),
	check("password", "La longitud minima de la contraseña debe ser 8").isLength({ min: 8 }),
	check("password", "La longitud máxima de la contraseña es de 50 carácteres").isLength({ max: 50 }),
	check("confirm_password")
		.custom((value, { req }) => {
			if (value !== req.body.password) throw new AppError("Las contraseñas no son iguales", badRequest);

			return true;
		})
	, userController.registroUser
);


module.exports = router;
