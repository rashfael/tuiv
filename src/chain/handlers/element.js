const {
	methodsReturningNewElementHandle,
	methodsChainingElementHandle
} = require('../consts')
const defaultHandler = require('./default')

const specialCharSplitter = /({.+?})/
const specialCharFinder = /{(.+?)}/

module.exports = async function (element, op, {chain, meta, assertion}) {
	if (op.get === 'find') op.get = 'waitForSelector'
	if (op.get === 'findAll' && op.apply) {
		// since waitForSelector only returns one element and $$ does not wait, call both
		meta.selectors.push(op.apply[0])
		await element.waitForSelector(...op.apply)
		return await element.$$(...op.apply)
	}
	if (op.get === 'clear' && op.apply) {
		await element.fill('')
		return element
	}
	if (op.get === 'type' && op.apply) {
		const [text, options] = op.apply
		const charChunks = text.split(specialCharSplitter)
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
	}

	if (op.get === 'closest' && op.apply) {
		const handle = await element.evaluateHandle(
			(el, selector) => el.closest(selector),
			op.apply[0]
		)
		return handle.asElement()
	}
	if (methodsReturningNewElementHandle.includes(op.get) && op.apply) {
		// record selector, let default handler do the rest
		meta.selectors.push(op.apply[0])
	}

	if (methodsChainingElementHandle.includes(op.get) && op.apply) {
		if (op.get === 'click') {
			// support named positions
			const posArg = op.apply[0]?.position
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
					op.apply[0].position = pos
				} else {
					op.apply[0].position = null
				}
			}
		}
		// chaining elements return null, so just drop result and return the same element
		await Reflect.apply(Reflect.get(element, op.get, element), element, op.apply)
		return element
	}

	return defaultHandler(element, op)
}
