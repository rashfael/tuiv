const path = require('path')
const { EventEmitter } = require('events')
const difference = require('lodash/difference')
const { rootSuite } = require('./context')
const Supervisor = require('./Supervisor')
const { config } = require('../config')

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
function generateExecutionPlan () {
	const plan = {
		tests: []
	}
	const suiteStack = []
	const fillFromSuite = function (suite) {
		for (const spec of suite.specs || []) {
			if (spec.modifiers?.includes('skip')) continue
			if (spec.modifiers?.includes('only')) plan.tests = []
			const suites = suiteStack.slice().reverse()
			let retries = 0
			if (spec.modifiers?.includes('flaky') || suites.some(suite => suite.modifiers?.includes('flaky'))) retries = 2
			// TODO cleanup recursive stuff and fn
			if (config.retries) retries = config.retries
			const test = {
				specId: getSpecId(suites, spec),
				title: spec.title,
				filepath: suites[0].filepath,
				retries,
				retriesLeft: retries,
				suites
			}
			plan.tests.push(test)
			spec.test = test // backlink to spec for report generation
			if (spec.modifiers?.includes('only')) return true
		}
		for (const subsuite of suite.suites || suite.files || []) {
			if (subsuite.modifiers?.includes('skip')) continue
			if (subsuite.modifiers?.includes('only')) plan.tests = []
			suiteStack.unshift(subsuite)
			if (fillFromSuite(subsuite)) return
			suiteStack.shift(subsuite)
			if (subsuite.modifiers?.includes('only')) return true
		}
	}

	fillFromSuite(rootSuite)

	return plan
}

function generateReport (rootSuite) {
	// generate report
	const report = {
		stats: rootSuite.stats,
		files: []
	}
	const traverseSuite = function (suite) {
		const suiteReport = {
			title: suite.title,
			stats: suite.stats,
			modifiers: suite.modifiers,
			suites: [],
			specs: []
		}
		for (const spec of suite.specs || []) {
			suiteReport.specs.push({
				title: spec.title,
				modifiers: spec.modifiers,
				maxRetries: spec.test?.retries,
				result: {
					retries: spec.test?.retries - spec.test?.retriesLeft,
					...spec.test?.result
				}
			})
		}
		for (const subsuite of suite.suites || []) {
			suiteReport.suites.push(traverseSuite(subsuite))
		}
		return suiteReport
	}
	for (const file of rootSuite.files) {
		const fileReport = traverseSuite(file)
		fileReport.filepath = path.relative(process.cwd(), file.filepath)
		report.files.push(fileReport)
	}
	return report
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
		const returnPromise = new Promise(resolve => resolveCb = resolve)
		const startedAt = Date.now()
		this.emit('runStart', rootSuite)
		const executionPlan = generateExecutionPlan()
		// console.log('EXECUTION PLAN:', executionPlan)
		this.supervisor = new Supervisor(executionPlan)
		let runningTest
		this.supervisor.on('testStart', test => {
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
		this.supervisor.on('testEnd', test => {
			rootSuite.incrementStat(test.result.status, test.suites)
			this.emit('testEnd', test)
		})
		for (const passThroughEvent of ['hookStart', 'hookEnd']) {
			this.supervisor.on(passThroughEvent, this.emit.bind(this, passThroughEvent))
		}
		this.supervisor.on('done', () => {
			this.emit('runEnd', rootSuite)
			const report = generateReport(rootSuite)
			report.startedAt = startedAt
			report.endedAt = Date.now()
			resolveCb(report)
		})
		this.supervisor.run()
		return returnPromise
	}
}
