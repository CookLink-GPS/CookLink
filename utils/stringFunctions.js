/**
 * Compares 2 strings
 *
 * @param {String} a
 * @param {String} b
 * @returns {Number} -1 if a should go before b, 0 if they are equal, 1 otherwise
 */
const stringComparator = (a, b) => {
	/* eslint-disable no-magic-numbers */
	if (a.toLowerCase() < b.toLowerCase()) return -1;
	if (a.toLowerCase() > b.toLowerCase()) return 1;
	return 0;
	/* eslint-enable no-magic-numbers */
};

/**
 * Removes accents from a given text
 *
 * @param {String} text
 * @returns {String}
 */
const removeAccents = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

module.exports = { stringComparator, removeAccents };
