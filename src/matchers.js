const chalk = require('chalk')
const isEqual = require('lodash/isEqual')

module.exports = {
	equals (chain) {

	},
	contains (chain) {
		if (Array.isArray(chain.subjectData)) {
			return {
				pass: chain.subjectData.includes(chain.expected), // TODO check soft equality
				message: chalk`{red {italic ${chain.selector}} {bold ${chain.subject}} does not contain {bold "${chain.expected}"}}\n\n\t{green Expected: {bold ${chain.expected}}}\n\t  {red Actual: {bold ${chain.subjectData}}}`
			}
		} else if (typeof chain.subjectData === 'string') {
			return {
				pass: chain.subjectData.toLowerCase().includes(chain.expected.toLowerCase()),
				message: chalk`{red {italic ${chain.selector}} {bold ${chain.subject}} does not contain {bold "${chain.expected}"}}\n\n\t{green Expected: {bold ${chain.expected}}}\n\t  {red Actual: {bold ${chain.subjectData}}}`
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
			message: chalk`{red {italic ${chain.selector}} should ${chain.not ? 'not' : ''} be {bold empty}}`
		}
	},
	disabled (chain) {
		return {
			pass: chain.subjectData,
			message: chalk`{red {italic ${chain.selector}} should ${chain.not ? 'not' : ''} be {bold disabled}}`
		}
	}
}
