const assert = require('assert')
const { describe, it } = require('./fixtures')

describe('BDD API', () => {
	it('should run a simple suite', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'pass.test.js': `
				describe('A suite', () => {
					it ('should run this test', async ({}) => {})
				})
			`
		})
		assert(results.exitCode === 0)
	})
	it('should fail a simple suite', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'fail.test.js': `
				describe('A suite', () => {
					it ('should run this test', async ({}) => {
						throw new Error('NO!')
					})
				})
			`
		})
		assert(results.exitCode === 1)
	})
})
