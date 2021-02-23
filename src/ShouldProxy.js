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
			const extractSubject = async () => {
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
					return Promise.reject(new Error(`${chain.selector} should not exist`))
				}).catch(error => {
					// silence timeout error
					if (error.name !== 'TimeoutError') return Promise.reject(error)
				})
			} else {
				const promise = chain.elementPromise.then(async element => {
					chain.expected = args[0]
					chain.element = element
					const startTime = Date.now()
					let pass, message
					do {
						chain.subjectData = await extractSubject()
						const result = await matchers[chain.verb || 'contains'](chain)
						pass = result.pass
						message = result.message
						pass = chain.not ? !pass : pass
						if (!pass) await promisedImmeditate()
					} while (!pass && Date.now() - startTime <= 10000)
					if (!pass) return Promise.reject(new Error(message))
					return chain.element
				})
				const ElementProxy = require('./ElementProxy')
				return ElementProxy(chain, promise)
			}
		}
	})
}

module.exports = ShouldProxy
