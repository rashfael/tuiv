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
	it('should handle weird errors', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'fail.test.js': `
				describe('A suite', () => {
					it ('should print error string', async ({}) => {
						throw 'no real Error'
					})
					it ('should print error object', async ({}) => {
						throw {error: 'not a real Error as well'}
					})
				})
			`
		})
		assert(results.exitCode === 1)
		assert(results.output.includes('no real Error'))
		assert(results.output.includes('not a real Error as well'))
	})
})
