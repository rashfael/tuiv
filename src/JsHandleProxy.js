const ChainingProxy = require('./ChainingProxy')
const ShouldProxy = require('./ShouldProxy')
const {
	promiseInstanceKeys
} = require('./consts')

const JsHandleProxy = function (chain, jsHandlePromise) {
	return ChainingProxy(chain, jsHandlePromise, {
		get (chain, jsHandlePromise, property, receiver) {
			// allow only should on value
			if (property === 'should') {
				chain.jsHandlePromise = jsHandlePromise
				chain.words = ['should']
				return ShouldProxy(chain)
			}
			if (promiseInstanceKeys.includes(property)) {
				return ChainingProxy(chain, Reflect.get(jsHandlePromise, property, receiver), {
					apply (chain, callTarget, thisArg, args) {
						return Reflect.apply(callTarget, jsHandlePromise, args)
					}
				})
			}
			chain.valueSelector = (chain.valueSelector || '') + '.' + property
			return JsHandleProxy(chain, jsHandlePromise.then(value => value[property]))
		}
	})
}

module.exports = JsHandleProxy
