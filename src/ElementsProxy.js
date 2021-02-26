const ChainingProxy = require('./ChainingProxy')
const ShouldProxy = require('./ShouldProxy')

const {
	promiseInstanceKeys
} = require('./consts')

const ElementsProxy = function (chain, elementsPromise) {
	return ChainingProxy(chain, elementsPromise, {
		get (chain, elementsPromise, property, receiver) {
			if (property === 'should') {
				// degrade to array value
				chain.valuePromise = elementsPromise
				chain.words = ['should']
				return ShouldProxy(chain)
			}
			if (Number.isInteger(Number(property))) {
				const ElementProxy = require('./ElementProxy')
				// TODO fail properly if index is not in array
				return ElementProxy(chain, elementsPromise.then(elements => elements[property]))
			}
			if (property === 'first') {
				const ElementProxy = require('./ElementProxy')
				// TODO fail properly if index is not in array
				return ElementProxy(chain, elementsPromise.then(elements => elements[0]))
			}
			if (property === 'last') {
				const ElementProxy = require('./ElementProxy')
				// TODO fail properly if index is not in array
				return ElementProxy(chain, elementsPromise.then(elements => elements[elements.length - 1]))
			}
			if (promiseInstanceKeys.includes(property)) {
				// TODO does this chain?
				// we need to re-proxy, because Promise.prototype.then cannot be called on Proxy
				return ChainingProxy(chain, Reflect.get(elementsPromise, property, receiver), {
					apply (chain, callTarget, thisArg, argumentsList) {
						return Reflect.apply(callTarget, elementsPromise, argumentsList)
					}
				})
			}

			return Reflect.get(elementsPromise, property, receiver)
		}
	})
}

module.exports = ElementsProxy
