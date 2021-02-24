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
	'disabled'
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

const ShouldProxy = function (chain) {
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
				}
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
				if (chain.elementPromise) {
					chain.element = await chain.elementPromise
					chain.subjectData = await extractElementSubject()
				}

				if (chain.valuePromise) {
					chain.subjectData = await chain.valuePromise
				}

				chain.expected = args[0]
				// start timing before element resolves?
				const startTime = Date.now()
				let pass, lastError
				const result = await matchers[chain.verb || 'contains'](chain)
				pass = result.pass
				lastError = new AssertionError({message: result.message})
				pass = chain.not ? !pass : pass
				if (pass) return chain.element ?? chain.subjectData
				console.log('replaying', chain.replaying)
				while (!chain.replaying && Date.now() - startTime <= 10000) {
					// TODO don't burn the CPU, wait a little
					await promisedImmeditate()
					console.log('RETRY')
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
	})
}

module.exports = ShouldProxy
