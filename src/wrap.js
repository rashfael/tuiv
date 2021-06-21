const ChainingProxy = require('./chain/ChainingProxy')

module.exports = function (thing) {
	return new ChainingProxy(thing)
}
