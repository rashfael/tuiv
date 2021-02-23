module.exports = function (chain, target, handler) {
	if (!chain) chain = {
		selectors: [],
		frames: [],
		elementPromise: null,
		element: null,
	}
	const handleWrapper = {}
	for (const key of Reflect.ownKeys(handler)) {
		handleWrapper[key] = function () {
			// be careful not to deep clone element
			const clonedChain = Object.assign({}, chain)
			clonedChain.selectors = chain.selectors.slice()
			clonedChain.frames = chain.frames.slice()
			return handler[key].call(this, clonedChain, ...arguments)
		}
	}
	return new Proxy(target, handleWrapper)
}
