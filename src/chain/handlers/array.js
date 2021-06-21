const defaultHandler = require('./default')

module.exports = async function (array, op, {chain, meta, assertion}) {
	meta.valueSelectors.push(op.get)
	if (op.get === 'first') {
		return array[0]
	}
	if (op.get === 'last') {
		return array[array.length - 1]
	}

	return defaultHandler(array, op)
}
