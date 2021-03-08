const { AssertionError } = require('assert')

const ChainingProxy = require('./ChainingProxy')
const matchers = require('./matchers')

const chainNops = [
	'be',
	'equal',
	'have'
]

const chainSubjects = [
	'text',
	'class',
	'empty',
	'disabled',
	'length',
	'value',
	'keys',
	'attr'
]

const chainVerbs = [
	['equals', 'equal', 'equaling'],
	['contains', 'contain', 'containing'],
	['exist', 'exists'],
	['empty'],
	['disabled']
]

const promisedImmeditate = function () {
	return new Promise((resolve) => setImmediate(resolve))
}

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

const ShouldProxy = function (chain, options = {}) {
	// use Function as proxy target to allow arbitrary function calling
	return ChainingProxy(chain, new Function(), {
		get (chain, target, property, receiver) {
			if (property === 'not') chain.not = !chain.not
			// chain.words.push(property)
			// TODO throw error when re-assigning subject or verb
			if (chainSubjects.includes(property)) chain.subject = property
			if (chainVerbsLookup[property]) chain.verb = chainVerbsLookup[property]
			return ShouldProxy(chain)
		},
		apply (chain, target, thisArg, args) {
			const extractElementSubject = async () => {
				const lastFrame = chain.frames[chain.frames.length - 1]
				switch (chain.subject) {
					case 'text': return await chain.element.textContent()
					case 'class': return await lastFrame.evaluate(el => Array.from(el.classList), chain.element)
					case 'empty': return await lastFrame.evaluate(el => el.matches(':empty'), chain.element)
					case 'disabled': return await lastFrame.evaluate(el => el.matches(':disabled'), chain.element)
					case 'value': {
						chain.verb = chain.verb || 'equals'
						return await lastFrame.evaluate(el => el.value, chain.element)
					}
					case 'attr': {
						chain.verb = chain.verb || 'haveAttr'
						return await lastFrame.evaluate(({el, attr}) => el.getAttribute(attr), {el: chain.element, attr: chain.expected})
					}
				}
			}

			const extractValueSubject = async () => {
				chain.verb = chain.verb || 'equals'
				if (!chain.subject) return chain.value
				switch (chain.subject) {
					case 'keys': return Object.keys(chain.value)
				}
				return chain.value[chain.subject]
			}

			if (chain.verb === 'exist' && chain.not) {
				return chain.elementPromise.then(() => {
					return Promise.reject(new AssertionError({message: `\n${chain.selectors.join(' ')} should not exist`}))
				}).catch(error => {
					// silence timeout error
					if (error.name !== 'TimeoutError') return Promise.reject(error)
				})
			}

			const resolve = async () => {
				chain.expected = args[0]
					chain.element = await chain.elementPromise
					if (!chain.subject) chain.subject = 'text'
					chain.subjectData = await extractElementSubject()
				}
				if (chain.valuePromise) {
					chain.value = await chain.valuePromise
				}

				if (chain.jsHandlePromise) {
					chain.jsHandle = await chain.jsHandlePromise
				}

				if (chain.jsHandle) {
					chain.value = await chain.jsHandle.evaluate(handle => handle)
				}

				if (chain.value !== undefined) {
					chain.subjectData = await extractValueSubject()
				}

				// start timing before element resolves?
				const startTime = Date.now()
				let pass, lastError
				const result = await matchers[chain.verb || 'contains'](chain)
				pass = result.pass
				lastError = new AssertionError({message: result.message})
				pass = chain.not ? !pass : pass
				if (pass) return chain.element ?? chain.subjectData
				while (!chain.replaying && Date.now() - startTime <= 10000) {
					// TODO don't burn the CPU, wait a little
					await promisedImmeditate()
					try {
						await ChainingProxy.replay(chain)
						return chain.element ?? chain.subjectData
					} catch (error) {
						if (!(error instanceof AssertionError)) throw error
						lastError = error
					}
				}
				throw lastError
			}

			let proxy
			if (chain.elementPromise) {
				proxy = require('./ElementProxy')
			} else if (chain.valuePromise) {
				proxy = require('./ValueProxy')
			}
			if (proxy) return proxy(chain, resolve())
			return resolve()

			// TODO abort if timeout reached but promise retry still running
			// TODO catch errors while retrying?
		}
	}, options)
}

module.exports = ShouldProxy
