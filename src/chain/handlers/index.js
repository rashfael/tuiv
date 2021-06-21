const { typeOf } = require('../type-check')
// const JsHandle = require('./jsHandle')
// const Value = require('./value')
module.exports.resolveHandler = function (thing) {
	try {
		return require('./' + typeOf(thing))
	} catch (error) {
		if (error.code === 'MODULE_NOT_FOUND') return require('./default')
		throw error
	}
}
