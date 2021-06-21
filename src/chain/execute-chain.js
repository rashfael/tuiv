const { AssertionError } = require('assert')
const {
	methodsChainingElementHandle
} = require('../consts')

const { resolveHandler } = require('./handlers')
const { parseShould, executeAssertion } = require('./should')

const promisedImmeditate = function () {
	return new Promise((resolve) => setImmediate(resolve))
}

module.exports = async function execute (chain, {replaying} = {}) {
	const startTime = Date.now()
	// merge get and apply ops into one, because applies alone are pretty useless without the method name
	const mergedOps = []
	for (const op of chain.ops) {
		const prevOp = mergedOps[mergedOps.length - 1]
		if (op.apply && prevOp && !prevOp.apply) {
			prevOp.apply = op.apply
		} else {
			mergedOps.push(Object.assign({}, op))
		}
	}
	// find `should`, split off assertion and parse BEFORE running ops, because assertion change op effects
	let assertion
	const shouldIndex = mergedOps.findIndex(op => op.get === 'should')
	if (shouldIndex >= 0) {
		const assertionOps = mergedOps.splice(shouldIndex)
		// remove should
		assertionOps.shift()
		assertion = parseShould(assertionOps)
	}
	// traverse chain
	let intermediate = chain.source // naming is hard
	// let handlers collect info into a meta param
	const meta = {
		selectors: [],
		valueSelectors: [] // merge into selectors?
	}
	for (const [index, op] of mergedOps.entries()) {
		// skip mutating actions when replaying
		if (replaying && methodsChainingElementHandle.includes(op.get)) continue
		const handler = resolveHandler(intermediate)
		intermediate = await handler(intermediate, op, index, {chain, meta, assertion})
	}
	if (assertion) {
		let lastError = await executeAssertion(intermediate, assertion, chain, meta)

		// eslint-disable-next-line no-unmodified-loop-condition
		while (lastError && !replaying && Date.now() - startTime <= 10000) {
			// TODO don't burn the CPU, wait a little
			await promisedImmeditate()
			try {
				await execute(chain, {replaying: true})
				return intermediate // do we actually want to return anything?
			} catch (error) {
				if (!(error instanceof AssertionError)) throw error
				lastError = error
			}
		}
		if (lastError) throw lastError
	}
	return intermediate // do we actually want to return anything?
}
