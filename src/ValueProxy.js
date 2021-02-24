const ChainingProxy = require('./ChainingProxy')
const ShouldProxy = require('./ShouldProxy')

module.exports = function (chain, frame) {
	return ChainingProxy(chain, frame, {
		get (chain, valuePromise, property, receiver) {
			// allow only should on value
			// TODO proxy object access
			if (property === 'should') {
				chain.valuePromise = valuePromise
				chain.words = ['should']
				return ShouldProxy(chain)
			}
			return Reflect.get(valuePromise, property, receiver)
		}
	})
}
