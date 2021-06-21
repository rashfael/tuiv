const defaultHandler = require('./default')
const ChainingProxy = require('../ChainingProxy')
module.exports = async function (array, op, {chain, meta, assertion}) {
	meta.valueSelectors.push(op.get)
	if (op.get === 'first') {
		return array[0]
	}
	if (op.get === 'last') {
		return array[array.length - 1]
	}
	if (op.get === 'forEach') {
		// rewrap each array item into a new chain
		// and execute in series
		const fn = op.apply[0]
		for (let i = 0; i < array.length; i++) {
			// TODO merge chain for better error messages
			await fn(new ChainingProxy(array[i]), i)
		}
		return
	}

	return defaultHandler(array, op)
}
