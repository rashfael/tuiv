const assert = require('assert')
const { describe, it } = require('./fixtures')

describe('CLI', () => {
	it('should print full exception when pausing on error', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'pass.test.js': `
				describe('A suite', () => {
					it ('should throw', async ({}) => {
						throw new Error('print this please!')
					})
				})
			`
		}, {
			params: ['--pause-on-error'],
			timeout: 1000
		})
		assert(results.exitCode === null)
		assert(results.output.includes('Error: print this please!'))
		assert(results.output.includes('throw new Error(\'print this please!\')'))
	})
})
