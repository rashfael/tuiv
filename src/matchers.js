const chalk = require('chalk')
const isEqual = require('lodash/isEqual')

const formatMessage = function (chain, text, {subject, expected, actual}) {
	const combinedSelector = chain.selectors.join(' ')
	return chalk.red(
		chalk.italic(combinedSelector) + ' ' +
		(subject ? chalk.bold(subject) + ' ' : '') +
		text +
		(expected ?
			'\n\n\t' + chalk.green('Expected: ', chalk.bold(expected)) +
			'\n\t  ' + chalk.red('Actual: ', chalk.bold(actual))
			: '')
	)
}

module.exports = {
	equals (chain) {

	},
	contains (chain) {
		if (Array.isArray(chain.subjectData)) {
			return {
				pass: chain.subjectData.includes(chain.expected), // TODO check soft equality
				message: formatMessage(chain, chalk`should contain {bold "${chain.expected}"}`, {
					subject: chain.subject,
					expected: chain.expected,
					actual: chain.subjectData
				})
			}
		} else if (typeof chain.subjectData === 'string') {
			return {
				pass: chain.subjectData.toLowerCase().includes(chain.expected.toLowerCase()),
				message: formatMessage(chain, chalk`should contain {bold "${chain.expected}"}`, {
					subject: chain.subject,
					expected: chain.expected,
					actual: chain.subjectData
				})
			}
		} else {
			return {
				pass: false,
				message: `unknown subject type ${typeof chain.subjectData}`
			}
		}
	},
	empty (chain) {
		return {
			pass: chain.subjectData,
			message: formatMessage(chain, chalk`should ${chain.not ? 'not' : ''} be {bold empty}}`)
		}
	},
	disabled (chain) {
		return {
			pass: chain.subjectData,
			message: formatMessage(chain, chalk`should ${chain.not ? 'not' : ''} be {bold disabled}}`)
		}
	}
}
