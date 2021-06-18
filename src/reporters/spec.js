// TODO
// print hook errors

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const StackUtils = require('stack-utils')
const { codeFrameColumns } = require('@babel/code-frame')

const stackUtils = new StackUtils({cwd: process.cwd()})

const symbols = {
	passed: '✔',
	failed: '✖',
	chevronRight: '›'
}

module.exports = function SpecReporter (runner, options) {
	let indentLevel = 0
	const failures = []

	const indent = function (string, overwriteIndents) {
		const indents = ' ' + '  '.repeat(overwriteIndents || indentLevel)
		return string.replace(/^(?=.)/gm, indents) // prefixes non-empty lines
	}

	const getSuiteName = function (suite) {
		return suite.title || path.relative(process.cwd(), suite.filepath)
	}

	const formatError = function (test, error) {
		const stack = stackUtils.clean(error.stack, 4)
		let callSite
		for (const line of stack.split('\n')) {
			callSite = stackUtils.parseLine(line)
			if (callSite) break
		}
		const sourcecode = fs.readFileSync(test.filepath, 'utf8')
		console.log()
		let output = ''
		output += indent(`${error.name}: ${error.message}\n`, 1)
		output += '\n' + indent(codeFrameColumns(sourcecode, {
			start: {
				line: callSite.line,
				column: callSite.column
			}
		}, {
			highlightCode: true
		}), 1) + '\n\n'
		output += indent(chalk.gray(stack), 1)
		return output
	}

	runner.on('runStart', rootSuite => {
		console.log()
		console.log(` running ${rootSuite.stats.specs} test specs across ${rootSuite.stats.suites} suites and ${rootSuite.stats.files} files`)
		console.log()
	})

	runner.on('runEnd', rootSuite => {
		const printFailedTest = function (test) {
			console.log(chalk` {red ${test.suites.map(getSuiteName).join(` ${symbols.chevronRight} `)} {bold ${test.title}}}`)
			if (test.result.error) {
				console.log(formatError(test, test.result.error))
			} else if (test.result.hookFail) {
				console.log(chalk`  {red {bold ${test.result.hookFail}} failed}`)
			}
		}
		const printFailedHook = function (hook) {
			console.log(chalk` {red ${hook.test.suites.map(getSuiteName).join(` ${symbols.chevronRight} `)} ${hook.test.title} ${symbols.chevronRight} {bold ${hook.type}}}`)
			console.log(formatError(hook.test, hook.error))
		}
		console.log()
		if (rootSuite.stats.failed === 0) {
			console.log(chalk` {green ${symbols.passed} ${rootSuite.stats.passed} tests passed}`)
		} else {
			failures.forEach(({test, hook}) => test ? printFailedTest(test) : printFailedHook(hook))
			console.log(chalk`\n {red ${symbols.failed} ${rootSuite.stats.failed} of ${rootSuite.stats.specs} tests failed}`)
		}
		console.log()
	})

	runner.on('suiteStart', suite => {
		console.log(indent(getSuiteName(suite)))
		indentLevel++
	})

	runner.on('suiteEnd', () => {
		indentLevel--
	})

	runner.on('hookStart', () => {

	})

	runner.on('hookEnd', (hook) => {
		if (hook.status === 'failed') {
			failures.push({hook})
		}
	})

	runner.on('testStart', test => {

	})

	runner.on('testEnd', test => {
		if (test.result.status === 'passed') {
			console.log(indent(chalk`{green ${symbols.passed}} {gray ${test.title}}`))
		} else if (test.result.status === 'failed') {
			failures.push({test})
			console.log(indent(chalk`{red ${symbols.failed} ${test.title}}`))
		}
	})
}
