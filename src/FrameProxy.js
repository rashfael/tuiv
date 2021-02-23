const ChainingProxy = require('./ChainingProxy')
const ElementProxy = require('./ElementProxy')
const { methodsReturningNewElementHandle } = require('./consts')

module.exports = function (chain, frame) {
	return ChainingProxy(chain, frame, {
		get (chain, frame, property, receiver) {
			if (property === 'get') property = 'waitForSelector'
			if (property === 'wait') property = 'waitForTimeout'
			if (methodsReturningNewElementHandle.includes(property)) {
				return new Proxy(Reflect.get(frame, property, receiver), {
					apply (elementPromise, thisArg, args) {
						chain.frames.push(frame)
						chain.selectors.push(args[0])
						return ElementProxy(chain, Reflect.apply(elementPromise, thisArg, args))
					}
				})
			}
			if (property === 'getAll') {
				// since waitForSelector only returns one element and $$ does not wait, call both
				return new Proxy(Reflect.get(frame, 'waitForSelector', receiver), {
					apply (elementPromise, thisArg, args) {
						const promise = Reflect.apply(elementPromise, thisArg, args).then(element => {
							return frame.$$(args[0])
						})
						chain.frames.push(frame)
						chain.selectors.push(args[0])
						return ElementProxy(chain, promise)
					}
				})
			}
			return Reflect.get(frame, property, receiver)
		}
	})
}
