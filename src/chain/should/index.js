const { AssertionError } = require('assert')
const { typeOf } = require('../type-check')
const matchers = require('./matchers')

const chainNops = [
	'be',
	'equal',
	'have'
]

const chainSubjects = [
	'text',
	'class',
	'disabled',
	'length',
	'value',
	'keys',
	'attr'
]

const chainVerbs = [
	['equals', 'equal', 'equaling'],
	['contains', 'contain', 'containing'],
	['includes', 'include'],
	['exist', 'exists'],
	['empty'],
	['disabled']
]

const chainVerbsLookup = chainVerbs.reduce((acc, verb) => {
	if (Array.isArray(verb)) {
		const canoncialName = verb[0]
		for (const v of verb) {
			acc[v] = canoncialName
		}
	} else {
		acc[verb] = verb
	}
	return acc
}, {})

module.exports.parseShould = function (ops, chain, meta) {
	// collect all the remaining ops into one assertion
	const assertion = {

	}
	for (const op of ops) {
		if (op.get) {
			if (op.get === 'not') assertion.not = !assertion.not
			// TODO throw error when re-assigning subject or verb
			if (chainSubjects.includes(op.get)) {
				assertion.subject = {
					name: op.get,
					params: op.apply
				}
				// continue
			}
			if (chainVerbsLookup[op.get]) {
				assertion.verb = chainVerbsLookup[op.get]
			}
		}
		if (op.apply) {
			// collect expected value for verbs and filler words
			assertion.expected = op.apply
		}
	}
	return assertion
}

module.exports.executeAssertion = async function (target, assertion, chain, meta) {
	if (assertion.subject?.data === undefined) {
		switch (typeOf(target)) {
			case 'element':
				if (!assertion.subject) assertion.subject = {name: 'text'}
				assertion.subject.data = await extractElementSubject(target, assertion)
				break
			case 'jshandle':
				target = await target.jsonValue() /* eslint-disable-line no-fallthrough */
			default: {
				const data = await extractValueSubject(target, assertion)
				if (assertion.subject) {
					assertion.subject.data = data
				} else {
					assertion.subject = {
						name: '',
						data
					}
				}
			}
		}
	}

	// if (chain.jsHandle) {
	// 	chain.value = await chain.jsHandle.evaluate(handle => handle)
	// }

	let {pass, message} = await matchers[assertion.verb || 'contains'](assertion, meta)
	pass = assertion.not ? !pass : pass
	if (pass) return
	return new AssertionError({
		message:
			typeof message === 'function'
				? message(assertion, meta)
				: message
	})
}

async function extractElementSubject (element, assertion) {
	switch (assertion.subject.name) {
		case 'text': return await element.textContent()
		case 'class': return await element.evaluate(el => Array.from(el.classList))
		case 'empty': return await element.evaluate(el => el.matches(':empty'))
		case 'disabled': return await element.evaluate(el => el.matches(':disabled'))
		case 'value': {
			assertion.verb = assertion.verb || 'equals'
			return await element.evaluate(el => el.value)
		}
		case 'attr': {
			assertion.verb = assertion.verb || 'haveAttr'
			return await element.evaluate((el, attr) => el.getAttribute(attr), assertion.subject.params[0])
		}
	}
}

async function extractValueSubject (value, assertion) {
	assertion.verb = assertion.verb || 'equals'
	if (!assertion.subject) return value
	switch (assertion.subject.name) {
		case 'keys': return Object.keys(value)
	}
	return value[assertion.subject.name]
}
