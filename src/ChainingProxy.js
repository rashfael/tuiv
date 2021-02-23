const cloneDeep = require('lodash/cloneDeep')

module.exports = function (chain, target, handler) {
	if (!chain) chain = {
		selectors: [],
		frames: [],
		elementPromise: null,
		element: null,
	}
	let visited = false
	const handleWrapper = {}
	for (const key of Reflect.ownKeys(handler)) {
		handleWrapper[key] = function () {
			if (visited) {
				chain = cloneDeep(chain)
			}
			visited = true
			return handler[key].call(this, chain, ...arguments)
		}
	}
	return new Proxy(target, handleWrapper)
}
