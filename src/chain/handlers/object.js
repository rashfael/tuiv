const defaultHandler = require('./default')

module.exports = async function (object, op, index, {chain, meta, assertion}) {
	meta.valueSelectors.push(op.get)
	return defaultHandler(object, op, index)
}
