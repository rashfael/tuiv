const ChainingProxy = require('./ChainingProxy')
const ShouldProxy = require('./ShouldProxy')
const {
	promiseInstanceKeys
} = require('./consts')

// const ValueProxy = function (chain, value) {
// 	if (!value || typeof value !== 'object') // TODO stricter testing?
// 		return value
// 	console.log('setting up value proxy', value)
// 	return ChainingProxy(chain, value, {
// 		get (chain, value, property, receiver) {
// 			console.log(property, Reflect.has(value, property))
// 			if (property === 'should') {
// 				chain.value = value
// 				chain.words = ['should']
// 				return ShouldProxy(chain)
// 			}
// 			if (Reflect.has(value, property)) {
// 				console.log('continue chain')
// 				return ValueProxy(chain, Reflect.get(value, property, receiver))
// 			}
// 			return Reflect.get(value, property, receiver)
// 		}
// 	})
// }

const ValueProxy = function (chain, valuePromise) {
	return ChainingProxy(chain, valuePromise, {
		get (chain, valuePromise, property, receiver) {
			// allow only should on value
			if (property === 'should') {
				chain.valuePromise = valuePromise
				chain.words = ['should']
				return ShouldProxy(chain)
			}
			if (promiseInstanceKeys.includes(property)) {
				return ChainingProxy(chain, Reflect.get(valuePromise, property, receiver), {
					apply (chain, callTarget, thisArg, args) {
						return Reflect.apply(callTarget, valuePromise, args)
					}
				})
			}
			chain.valueSelector = (chain.valueSelector || '') + '.' + property
			return ValueProxy(chain, valuePromise.then(value => value[property]))
		}
	})
}

module.exports = ValueProxy
