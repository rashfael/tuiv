const { methodsChainingElementHandle } = require('./consts')

const ChainingProxy = function (chain, target, handler = {}, { overrides, frame } = {}) {
	if (!chain) chain = {
		ops: [],
		selectors: [],
		frames: [],
		elementPromise: null,
		element: null,
		replaying: false
	}
	if (overrides) {
		Object.assign(chain, overrides)
	}
	if (frame) chain.frames.push(frame)

	// always patch in apply to catch all function calls
	if (!handler.apply) {
		handler.apply = function (chain, callTarget, thisArg, args) {
			return Reflect.apply(callTarget, thisArg, [chain, ...args])
		}
	}
	const handleWrapper = {}
	for (const key of Reflect.ownKeys(handler)) {
		handleWrapper[key] = function () {
			// be careful not to deep clone element
			const clonedChain = Object.assign({}, chain)
			clonedChain.selectors = chain.selectors.slice()
			clonedChain.frames = chain.frames.slice()
			clonedChain.ops = [...chain.ops, [key, arguments]]
			return handler[key].call(this, clonedChain, ...arguments)
		}
	}
	return new Proxy(target, handleWrapper)
}

ChainingProxy.replay = function (chain) {
	let target
	if (chain.frames[0]) {
		const FrameProxy = require('./FrameProxy')
		target = FrameProxy(null, chain.frames[0], {overrides: {replaying: true}})
	} else if (chain.jsHandlePromise) {
		const JsHandleProxy = require('./JsHandleProxy')
		target = JsHandleProxy(null, chain.jsHandlePromise)
	}
	let prevTarget = null
	for (const [key, args] of chain.ops) {
		if (key === 'get') {
			// skip mutating actions
			if (methodsChainingElementHandle.includes(args[1])) continue
			prevTarget = target
			target = Reflect.get(target, args[1], target)
		} else if (key === 'apply') {
			// TODO also set prevTarget here?
			target = Reflect.apply(target, prevTarget, args[2])
		}
	}
	return target
}

module.exports = ChainingProxy