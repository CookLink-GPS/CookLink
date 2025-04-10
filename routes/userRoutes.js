const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { check } = require("express-validator");
const AppError = require("../utils/AppError");
const { badRequest } = require("../config/httpcodes");
const { userRoutes } = require("../config/routes");

router.get(userRoutes.getAllUsers, userController.getAllUsers);
router.get(userRoutes.login, userController.toLogin);
router.post(userRoutes.login, userController.login);
router.get(userRoutes.register, userController.toRegister);
router.delete(userRoutes.delete, userController.deleteUser);
router.post(
	userRoutes.register,
	check("password", "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&'*+-/=.?^_{|}@(),:;<>@[])/),
	check("password", "La longitud minima de la contraseña debe ser 8").isLength({ min: 8 }),
	check("password", "La longitud máxima de la contraseña es de 50 carácteres").isLength({ max: 50 }),
	check("confirm_password")
		.custom((value, { req }) => {
			if (value !== req.body.password) throw new AppError("Las contraseñas no son iguales", badRequest);

			return true;
		})
	, userController.register
);

module.exports = router;
