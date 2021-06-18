const { EventEmitter } = require('events')
const difference = require('lodash/difference')
const { rootSuite } = require('./context')
const Supervisor = require('./Supervisor')

// identify spec by position in suite tree starting at file level
const getSpecId = function (suites, spec) {
	suites = suites.slice()
	const idParts = []
	let parentSuite = suites.shift()
	while (suites.length) {
		const suite = suites.shift()
		idParts.push(parentSuite.suites.indexOf(suite))
		parentSuite = suite
	}
	idParts.push(parentSuite.specs.indexOf(spec))
	return idParts.join(':')
}

// super simple plan, just run all test specs in all suites in a flat list, no deps for now
// in the future, build execution blocks to optimize shared fixtures
// support exclusive test suites
const generateExecutionPlan = function () {
	const plan = {
		tests: []
	}
	const suiteStack = []
	const fillFromSuite = function (suite) {
		for (const spec of suite.specs || []) {
			// TODO cleanup recursive stuff and fn
			const suites = suiteStack.slice().reverse()
			plan.tests.push({
				specId: getSpecId(suites, spec),
				title: spec.title,
				filepath: suites[0].filepath,
				suites
			})
		}
		for (const subsuite of suite.suites || suite.files || []) {
			suiteStack.unshift(subsuite)
			fillFromSuite(subsuite)
			suiteStack.shift(subsuite)
		}
	}

	fillFromSuite(rootSuite)

	return plan
}

module.exports = class Runner extends EventEmitter {
	constructor (testFilePaths) {
		super()
		this.testFilePaths = testFilePaths
	}

	async loadFiles () {
		for (const path of this.testFilePaths) {
			rootSuite.loadFile(path)
		}
	}

	async run () {
		let resolveCb
		this.emit('runStart', rootSuite)
		const executionPlan = generateExecutionPlan()
		// console.log('EXECUTION PLAN:', executionPlan)
		const supervisor = new Supervisor(executionPlan)
		let runningTest
		supervisor.on('testStart', test => {
			const exitingSuites = difference(runningTest?.suites, test.suites)
			const enteringSuites = difference(test.suites, runningTest?.suites)
			for (const suite of exitingSuites) {
				this.emit('suiteEnd', suite)
			}
			for (const suite of enteringSuites) {
				this.emit('suiteStart', suite)
			}
			this.emit('testStart', test)
			runningTest = test
		})
		supervisor.on('testEnd', test => {
			rootSuite.incrementStat(test.result.status, test.suites)
			this.emit('testEnd', test)
		})
		for (const passThroughEvent of ['hookStart', 'hookEnd']) {
			supervisor.on(passThroughEvent, this.emit.bind(this, passThroughEvent))
		}
		supervisor.on('done', () => {
			this.emit('runEnd', rootSuite)
			resolveCb(rootSuite)
		})
		supervisor.run()
		return new Promise(resolve => resolveCb = resolve)
	}
}
