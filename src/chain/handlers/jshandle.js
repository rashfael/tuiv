const defaultHandler = require('./default')

module.exports = async function (jshandle, op, index, {chain, meta, assertion}) {
	meta.valueSelectors.push(op.get)
	return defaultHandler(jshandle, op)
}
