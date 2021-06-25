const { config } = require('../../config')
const { methodsReturningNewElementHandle } = require('../consts')
const defaultHandler = require('./default')
const { handleExistAssertWithPlaywright } = require('./utils')

module.exports = async function (frame, op, index, {chain, block, meta, assertion}) {
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
	if (await handleExistAssertWithPlaywright(frame, op, index, {block, assertion})) return
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
