const { AssertionError } = require('assert')
const {
	methodsChainingElementHandle,
	assertionExitWords
} = require('./consts')

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
	// find all alternating command and assertion blocks
	// we split ops into blocks, because assertion ops get parsed as one
	// and we need the next assertion for preceding commands
	let currentBlock = {type: 'commands', ops: []}
	const blocks = [currentBlock]
	for (const op of mergedOps) {
		if (currentBlock.type === 'commands' && op.get === 'should') {
			// start assertion, drop `should` op
			currentBlock = {type: 'assertion', ops: [], assertion: null}
			blocks.push(currentBlock)
			continue
		} else if (currentBlock.type === 'assertion' && assertionExitWords.includes(op.get)) {
			// parse assertion ops
			currentBlock.assertion = parseShould(currentBlock.ops)
			currentBlock = {type: 'commands', ops: []}
			blocks.push(currentBlock)
		}
		currentBlock.ops.push(op)
	}
	// finish open assertion block
	if (currentBlock.type === 'assertion') {
		currentBlock.assertion = parseShould(currentBlock.ops)
	}

	// traverse chain
	let intermediate = chain.source // naming is hard
	// let handlers collect info into a meta param
	const meta = {
		selectors: [],
		valueSelectors: [] // merge into selectors?
	}
	// run command and assertion blocks
	for (const [index, block] of blocks.entries()) {
		if (block.type === 'commands') {
			// next block is the corresponding assertion
			// we need to look ahead, because assertions might change behaviour of commands
			const assertion = blocks[index + 1]?.assertion
			for (const op of block.ops) {
				// skip mutating actions when replaying
				if (replaying && methodsChainingElementHandle.includes(op.get)) continue
				const handler = resolveHandler(intermediate)
				intermediate = await handler(intermediate, op, {chain, meta, assertion})
			}
		}
		if (block.type === 'assertion') {
			let lastError = await executeAssertion(intermediate, block.assertion, chain, meta)

			// eslint-disable-next-line no-unmodified-loop-condition
			while (lastError && !replaying && Date.now() - startTime <= 10000) {
				// TODO don't burn the CPU, wait a little
				await promisedImmeditate()
				lastError = null
				try {
					await execute(chain, {replaying: true})
				} catch (error) {
					if (!(error instanceof AssertionError)) throw error
					lastError = error
				}
			}
			if (lastError) throw lastError
		}
	}

	return intermediate // do we actually want to return anything?
}
