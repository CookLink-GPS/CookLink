/**
 * Función para renderizar vistas con datos predefinidos y personalizados.
 *
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {string} view - Nombre de la vista a renderizar.
 * @param {number} status - Código de estado HTTP de la respuesta.
 * @param {Object} [data={}] - Datos adicionales opcionales para la vista.
 */
module.exports = {
	renderView: (res, view, status, data = {}) => {
		const defaultData = {
			mensajeError: null, // Mensaje de error por defecto
			mensajeExito: null, // Puedes añadir mensajes de éxito si lo necesitas
			usuario: null // Si más adelante manejas sesiones de usuario
		};

		res.status(status);
		res.render(view, { ...defaultData, ...data });
	}
};
