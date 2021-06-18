const { FixtureBuilder, getFunctionFixtures } = require('./FixtureBuilder')

function getFreshStats () {
	return {
		suites: 0,
		specs: 0,
		passed: 0,
		failed: 0,
		skipped: 0
	}
}

let suiteStack = []
const rootSuite = {
	files: [],
	stats: {
		files: 0,
		...getFreshStats()
	},
	loadFile (filepath) {
		const file = {
			filepath,
			suites: [],
			stats: getFreshStats()
		}
		this.files.push(file)
		this.stats.files++
		suiteStack = [file]
		require(filepath)
		return file
	},
	incrementStat (type, suites) {
		if (!suites) suites = suiteStack
		rootSuite.stats[type]++
		for (const suite of suites) {
			suite.stats[type]++
		}
	}
}

function Context (fixtures) {
	const context = {
		extend () {
			return FixtureBuilder(context, fixtures)
		}
	}

	const MODIFIABLES = {
		describe (modifiers, title, fn) {
			const suite = {
				title,
				modifiers,
				suites: [],
				specs: [],
				hooks: [],
				stats: getFreshStats()
			}
			suiteStack[0].suites.push(suite)
			suiteStack.unshift(suite)
			rootSuite.incrementStat('suites')
			fn()
			suiteStack.shift()
		},
		it (modifiers, title, fn) {
			rootSuite.incrementStat('specs')
			suiteStack[0].specs.push({
				title,
				modifiers,
				fn,
				fixtures: getFunctionFixtures(fn).map(name => {
					if (!fixtures.has(name)) {
						throw new Error(`fixture ${name} not defined for spec ${title}`)
					}
					return fixtures.get(name)
				})
			})
		},
		...(function generateHooks (types) {
			const hooks = {}
			for (const type of types) {
				hooks[type] = function (modifiers, fn) {
					suiteStack[0].hooks.push({
						type,
						modifiers,
						fn,
						fixtures: getFunctionFixtures(fn).map(name => {
							if (!fixtures.has(name)) {
								throw new Error(`fixture ${name} not defined for hook ${type}`)
							}
							return fixtures.get(name)
						})
					})
				}
			}
			return hooks
		})(['beforeAll', 'beforeEach', 'afterAll', 'afterEach'])
	}
	const MODIFIERS = ['skip', 'only']
	for (const [key, fn] of Object.entries(MODIFIABLES)) {
		context[key] = fn.bind(null, [])
		for (const modifier of MODIFIERS) {
			context[key][modifier] = fn.bind(null, [modifier])
		}
	}

	return context
}

module.exports = {
	rootSuite,
	Context
}
