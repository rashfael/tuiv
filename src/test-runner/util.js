const util = require('util')

module.exports.serializeError = function serializeError (error) {
	if (error instanceof Error) {
		return {
			name: error.name,
			message: error.message,
			stack: error.stack
		}
	}
	return {
		value: util.inspect(error)
	}
}
