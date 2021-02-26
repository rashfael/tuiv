const ChainingProxy = require('./ChainingProxy')
const ShouldProxy = require('./ShouldProxy')
const {
	promiseInstanceKeys
} = require('./consts')

module.exports = function (chain, valuePromise) {
	return ChainingProxy(chain, valuePromise, {
		get (chain, valuePromise, property, receiver) {
			// allow only should on value
			// TODO proxy object access
			if (property === 'should') {
				chain.valuePromise = valuePromise
				chain.words = ['should']
				return ShouldProxy(chain)
			}
			if (promiseInstanceKeys.includes(property)) {
				// TODO does this chain?
				// we need to re-proxy, because Promise.prototype.then cannot be called on Proxy
				return ChainingProxy(chain, Reflect.get(valuePromise, property, receiver), {
					apply (chain, callTarget, thisArg, argumentsList) {
						return Reflect.apply(callTarget, valuePromise, argumentsList)
					}
				})
			}
			return Reflect.get(valuePromise, property, receiver)
		}
	})
}
