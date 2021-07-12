const assert = require('assert')
const { describe, it } = require('./fixtures')

describe('modifiers', () => {
	it('should skip test', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'pass.test.js': `
				describe('A suite', () => {
					it.skip('should skip this test', async ({}) => {
						console.log('DIDNT SKIP')
					})
				})
			`
		})
		assert(results.exitCode === 0)
		assert(!results.output.includes('DIDNT SKIP'))
	})
	it('should skip suite', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'pass.test.js': `
				describe.skip('A suite', () => {
					it('should skip this test', async ({}) => {
						console.log('DIDNT SKIP')
					})
				})
			`
		})
		assert(results.exitCode === 0)
		assert(!results.output.includes('DIDNT SKIP'))
	})
})
