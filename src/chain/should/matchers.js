const chalk = require('chalk')
const isEqual = require('lodash/isEqual')

const formatMessage = function (text, {showSubject = true} = {}) {
	return function ({subject, expected}, {selectors, valueSelectors}) {
		const combinedSelector = selectors.join(' ')
		return chalk.red(
			chalk.italic(combinedSelector) + ' '
			+ (valueSelectors ? chalk.bold(valueSelectors.join('.')) + '’ ' : '')
			+ (subject && showSubject ? chalk.bold(subject.name) + ' ' : '')
			+ text
			+ (expected !== undefined && expected.length > 0
				? '\n\n\t' + chalk.green('Expected: ', chalk.bold(expected))
					+ '\n\t  ' + chalk.red('Actual: ', chalk.bold(subject.data))
				: '')
		)
	}
}

module.exports = {
	equals ({subject: {data}, expected: [expected]}, meta) {
		return {
			pass: isEqual(data, expected),
			message: formatMessage(chalk`should equal {bold "${expected}"}`)
		}
	},
	contains ({subject: {data}, expected: [expected], not}, meta) {
		if (Array.isArray(data)) {
			return {
				pass: data.includes(expected), // TODO check soft equality
				message: formatMessage(chalk`should ${not ? 'not' : ''} contain {bold "${expected}"}`)
			}
		} else if (typeof data === 'string') {
			return {
				pass: data
					.toLowerCase()
					.includes(expected.toLowerCase()),
				message: formatMessage(chalk`should ${not ? 'not' : ''} contain {bold "${expected}"}`)
			}
		} else {
			return {
				pass: false,
				message: `unknown subject type ${typeof data}`
			}
		}
	},
	includes ({subject: {data}, expected: [expected], not}, meta) {
		// console.log(chain.subjectData)
		if (Array.isArray(data)) {
			// TODO
		} else if (typeof data === 'object') {
			return {
				pass: Object.entries(expected).every(([key, value]) => data[key] === value),
				message: formatMessage(chalk`should ${not ? 'not' : ''} include {bold "${expected}"}`)
			}
		} else {
			return {
				pass: false,
				message: `unknown subject type ${typeof data}`
			}
		}
	},
	empty ({subject: {data}, expected: [expected], not}, meta) {
		return {
			pass: data.length !== undefined ? data.length === 0 : !data,
			message: formatMessage(chalk`should ${not ? 'not' : ''} be {bold empty}`)
		}
	},
	disabled ({subject: {data}, expected: [expected], not}, meta) {
		return {
			pass: data,
			message: formatMessage(chalk`should ${not ? 'not' : ''} be {bold disabled}`)
		}
	},
	haveAttr ({subject: {data}, expected: [expected], not}, meta) {
		return {
			pass: data !== null,
			message: formatMessage(chalk`should ${not ? 'not' : ''} have attribute {bold ${expected}}`)
		}
	},
	async exist ({subject: {data}, not}, meta) {
		return {
			pass: data,
			message: formatMessage(chalk`should ${not ? 'not' : ''} exist`, {showSubject: false})
		}
	}
}
