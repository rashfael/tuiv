const ChainingProxy = require('./ChainingProxy')
const ShouldProxy = require('./ShouldProxy')
const ElementsProxy = require('./ElementsProxy')
const ValueProxy = require('./ValueProxy')

const {
	methodsReturningNewElementHandle,
	methodsChainingElementHandle,
	methodsReturningNewFrame,
	promiseInstanceKeys
} = require('./consts')

const specialCharSplitter = /({.+?})/
const specialCharFinder = /{(.+?)}/

const ElementProxy = function (chain, elementPromise) {
	return ChainingProxy(chain, elementPromise, {
		get (chain, elementPromise, property, receiver) {
			if (property === 'should') {
				chain.elementPromise = elementPromise
				chain.words = ['should']
				return ShouldProxy(chain)
			}
			if (promiseInstanceKeys.includes(property)) {
				// TODO does this chain?
				// we need to re-proxy, because Promise.prototype.then cannot be called on Proxy
				return ChainingProxy(chain, Reflect.get(elementPromise, property, receiver), {
					apply (chain, callTarget, thisArg, argumentsList) {
						return Reflect.apply(callTarget, elementPromise, argumentsList)
					}
				})
			}
			if (property === 'find') property = 'waitForSelector'
			if (property === 'findAll') {
				return ChainingProxy(chain, (chain, ...args) => {
					chain.selectors.push(args[0])
					const promise = elementPromise.then(async element => {
						await Reflect.apply(element.waitForSelector, element, args)
						return Reflect.apply(element.$$, element, args)
					})
					return ElementsProxy(chain, promise)
				})
			}
			if (property === 'clear') {
				return ChainingProxy(chain, (chain) => {
					const promise = elementPromise.then(element => element.fill('')).then(() => elementPromise)
					return ElementProxy(chain, promise)
				})
			}
			if (property === 'type') {
				return ChainingProxy(chain, (chain, text, options) => {
					const charChunks = text.split(specialCharSplitter)
					const promise = elementPromise.then(async element => {
						for (const chunk of charChunks) {
							if (chunk === '') continue
							const found = specialCharFinder.exec(chunk)
							if (found) {
								await element.press(found[1], options)
							} else {
								await element.type(chunk, options)
							}
						}
						return element
					})
					return ElementProxy(chain, promise)
				})
			}
			if (property === 'boundingBox') {
				return ChainingProxy(chain, (chain, ...args) => {
					const promise = elementPromise.then(element => Reflect.apply(Reflect.get(element, property, receiver), element, args))
					return ValueProxy(chain, promise)
				})
			}
			// if (property === 'evaluateHandle') {
			// 	return ChainingProxy(chain, (chain, ...args) => {
			// 		const promise = elementPromise.then(element => Reflect.apply(Reflect.get(element, property, receiver), element, args))
			// 	})
			//
			// 		Reflect.get(frame, property, receiver), {
			// 		apply (chain, valuePromiseFn, thisArg, args) {
			// 			if (typeof args[0] === 'string') chain.valueSelector = args[0]
			// 			return ValueProxy(chain, Reflect.apply(valuePromiseFn, thisArg, args))
			// 		}
			// 	})
			// }
			if (property === 'closest') {
				return ChainingProxy(chain, (chain, ...args) => {
					const promise = elementPromise.then(element => element.evaluateHandle((el, selector) => el.closest(selector), args[0])).then(handle => handle.asElement())
					return ElementProxy(chain, promise)
				})
			}
			if (methodsReturningNewElementHandle.includes(property)) {
				return ChainingProxy(chain, (chain, ...args) => {
					const promise = elementPromise.then(element => Reflect.apply(Reflect.get(element, property, receiver), element, args))
					return ElementProxy(chain, promise)
				})
			}
			if (methodsChainingElementHandle.includes(property)) {
				return ChainingProxy(chain, (chain, ...args) => {
					// chaining elements return null, so just drop result
					const promise = elementPromise.then(async element => {
						if (property === 'click') {
							const posArg = args[0]?.position
							if (typeof posArg === 'string') {
								// TODO scroll into view if needed ?
								// TODO mor positions
								let pos
								const box = await element.boundingBox()
								switch (posArg) {
									case 'left': pos = {x: 0, y: box.height / 2}; break
									case 'right': pos = {x: box.width - 1, y: box.height / 2}; break
								}
								if (pos) {
									args[0].position = pos
								} else {
									args[0].position = null
								}
							}
						}
						await Reflect.apply(Reflect.get(element, property, element), element, args)
						return elementPromise
					})
					return ElementProxy(chain, promise)
				})
			}
			if (methodsReturningNewFrame.includes(property)) {
				const FrameProxy = require('./FrameProxy')
				// TODO make chainable
				return ChainingProxy(chain, (chain) => elementPromise.then(element => Reflect.apply(Reflect.get(element, property, receiver), element, [])).then(frame => FrameProxy(chain, frame)))
			}

			return Reflect.get(elementPromise, property, receiver)
		}
	})
}

module.exports = ElementProxy