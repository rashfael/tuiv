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
	it('should run hooks', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'hook.test.js': `
				describe('A suite', () => {
					beforeAll(async ({}) => {
						console.log('BEFORE ALL')
					})
					beforeEach(async ({}) => {
						console.log('BEFORE EACH')
					})
					afterAll(async ({}) => {
						console.log('AFTER ALL')
					})
					afterEach(async ({}) => {
						console.log('AFTER EACH')
					})
					it ('should run this test', async ({}) => {})
					it ('should run another test', async ({}) => {})
				})
			`
		})
		console.log(results.output)
		assert(results.output.split('BEFORE ALL').length - 1 === 1)
		assert(results.output.split('BEFORE EACH').length - 1 === 2)
		assert(results.output.split('AFTER ALL').length - 1 === 1)
		assert(results.output.split('AFTER EACH').length - 1 === 2)
		assert(results.exitCode === 0)
	})
})
