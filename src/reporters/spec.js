const chalk = require('chalk')

const symbols = {
	passed: '✔',
	failed: '✖'
}

module.exports = function SpecReporter (runner, options) {

	let indentLevel = 0

	const indent = function () {
		return '  '.repeat(indentLevel)
	}

	runner.on('runStart', rootSuite => {
		console.log()
		console.log(` running ${rootSuite.stats.specs} test specs across ${rootSuite.stats.suites} suites and ${rootSuite.stats.files} files`)
		console.log()
	})

	runner.on('runEnd', rootSuite => {
		console.log()
		if (rootSuite.stats.failed === 0) {
			console.log(chalk` {green ${symbols.passed} ${rootSuite.stats.passed} tests passed}`)
		}
		console.log()
	})

	runner.on('suiteStart', suite => {
		console.log(indent(), suite.title || suite.filepath)
		indentLevel++
	})

	runner.on('suiteEnd', () => {
		indentLevel--
	})

	runner.on('hookStart', () => {

	})

	runner.on('hookEnd', () => {

	})

	runner.on('testStart', test => {

	})

	runner.on('testEnd', test => {
		if (test.result.status === 'passed') {
			console.log(indent(), chalk`{green ${symbols.passed}} {gray ${test.title}}`)
		} else if (test.result.status === 'failed') {
			console.log(indent(), chalk`{red ${symbols.failed} ${test.title}}`)
		}

	})
}
