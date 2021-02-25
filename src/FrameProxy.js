const ChainingProxy = require('./ChainingProxy')
const ElementProxy = require('./ElementProxy')
const ValueProxy = require('./ValueProxy')
const { methodsReturningNewElementHandle } = require('./consts')

module.exports = function (chain, frame, options = {}) {
	options.frame = frame
	return ChainingProxy(chain, frame, {
		get (chain, frame, property, receiver) {
			if (property === 'get') property = 'waitForSelector'
			if (property === 'wait') property = 'waitForTimeout'
			if (methodsReturningNewElementHandle.includes(property)) {
				return ChainingProxy(chain, Reflect.get(frame, property, receiver), {
					apply (chain, callTarget, thisArg, args) {
						chain.selectors.push(args[0])
						return ElementProxy(chain, Reflect.apply(callTarget, thisArg, args))
					}
				})
			}
			if (property === 'getAll') {
				// since waitForSelector only returns one element and $$ does not wait, call both
				return ChainingProxy(chain, Reflect.get(frame, 'waitForSelector', receiver), {
					apply (chain, elementPromise, thisArg, args) {
						chain.selectors.push(args[0])
						const promise = Reflect.apply(elementPromise, thisArg, args).then(element => {
							return frame.$$(args[0])
						})
						chain.selectors.push(args[0])
						return ValueProxy(chain, promise)
					}
				})
			}
			if (property === 'evaluate') {
				return ChainingProxy(chain, Reflect.get(frame, property, receiver), {
					apply (chain, valuePromise, thisArg, args) {
						if (typeof args[0] === 'string') chain.valueSelector = args[0]
						return ValueProxy(chain, Reflect.apply(valuePromise, thisArg, args))
					}
				})
			}
			return Reflect.get(frame, property, receiver)
		}
	}, options)
}
