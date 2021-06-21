const { promiseInstanceKeys } = require('./consts')
const execute = require('./execute-chain')

// starts or continues a call chain
// uses Proxy to record attribute access and function call arguments
// we clone the chain on each step to make branches possible
// needs to extend a Function to allow function calls to be recorded
// chain will execute when it is awaited or called as a promise via `then`
// `await` calls `then(onResolve, onReject)` internally
class ChainingProxy extends Function {
	constructor (chainOrSource, newOp) {
		super()
		if (chainOrSource instanceof ChainingProxy) {
			// clone parent chain
			this.ops = [...chainOrSource.ops, newOp]
			this.source = chainOrSource.source
		} else {
			// create new root
			this.ops = []
			this.source = chainOrSource
		}
		const chain = this
		return new Proxy(this, {
			get (_target, property, _receiver) {
				// TODO only intercept `then`, since we're not sharing promises between `then` and an additional `catch`? (only a problem if `catch` is called in parallel instead of chained after `then`)
				if (promiseInstanceKeys.includes(property)) {
					// TODO record stack
					// const stack = {}
					// Error.captureStackTrace(stack)
					// console.log('STACK', stack, stack.stack)
					return function () {
						execute(chain).then(...arguments)
					}
				}
				return new ChainingProxy(chain, {
					get: property
				})
			},
			apply (_callTarget, _thisArg, args) {
				return new ChainingProxy(chain, {
					apply: args
				})
			}
		})
	}
}

module.exports = ChainingProxy
