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

	it('should retry tests when setting global param', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'flaky.test.js': `
				describe('A suite', () => {
					it('should retry this test', async ({}) => {
						console.log('FLAKE')
						throw new Error('flaked')
					})
				})
			`
		}, {
			params: ['--retries', '3'],
			timeout: 1000
		})
		assert(results.exitCode === 1)
		assert.equal(results.output.split('FLAKE\n').length - 1, 4)
	})
})
