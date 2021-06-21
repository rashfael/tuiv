const { config } = require('../../config')
const { methodsReturningNewElementHandle } = require('../consts')
const defaultHandler = require('./default')

module.exports = async function (frame, op, {chain, meta, assertion}) {
	// clone op so we can modify it without breaking replays
	op = Object.assign({}, op)
	if (op.get === 'goto' && op.apply) {
		const url = op.apply.shift()
		if (url.startsWith('http')) return frame.goto(url, ...op.apply)
		return frame.goto(config.baseUrl + url, ...op.apply)
	}
	if (op.get === 'get') op.get = 'waitForSelector'
	if (op.get === 'wait') op.get = 'waitForTimeout'
	if (methodsReturningNewElementHandle.includes(op.get) && op.apply) {
		// record selector, let default handler do the rest
		meta.selectors.push(op.apply[0])
	}
	// use playwright to check for non-existing element by using state: 'hidden'
	// fill assertion.subject directly and generate message in matcher
	if (op.get === 'waitForSelector' && op.apply && assertion?.verb === 'exist') {
		if (assertion.not) {
			// should not exist
			try {
				await frame.waitForSelector(op.apply[0], Object.assign({timeout: 5000}, op.apply[1], {state: 'hidden'}))
			} catch (error) {
				if (error.name !== 'TimeoutError') throw error
			}
			assertion.subject = {
				name: 'existence',
				data: false
			}
		} else {
			// should exist
			try {
				await frame.waitForSelector(op.apply[0], op.apply[1])
			} catch (error) {
				if (error.name !== 'TimeoutError') throw error
			}
			assertion.subject = {
				name: 'existence',
				data: true
			}
		}
		return // return nothing, there should be nothing else in the chain
	}
	if (op.get === 'getAll' && op.apply) {
		// since waitForSelector only returns one element and $$ does not wait, call both
		meta.selectors.push(op.apply[0])
		await frame.waitForSelector(...op.apply)
		return await frame.$$(...op.apply)
	}
	if (op.get === 'evaluate' && op.apply) {
		if (typeof op.apply[0] === 'string') {
			meta.valueSelectors.push(op.apply[0])
			return JSON.parse(await frame.evaluate(`JSON.stringify(${op.apply[0]}, ${op.apply[1] ? JSON.stringify(op.apply[1]) : 'null'})`))
		}
		// let the default handler handle other cases
	}
	return defaultHandler(frame, op)
}
