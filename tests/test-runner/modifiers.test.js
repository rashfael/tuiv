// TODO .only
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

	it('should retry flaky test', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'flaky.test.js': `
				let flakeCounter = 0
				describe('A suite', () => {
					it.flaky('should retry this test', async ({}) => {
						flakeCounter++
						if(flakeCounter < 3) {
							console.log('FLAKE')
							throw new Error('flaked')
						}
					})
				})
			`
		})
		assert(results.exitCode === 0)
		assert.equal(results.output.split('FLAKE\n').length - 1, 2)
	})

	it('should fail flaky test after 3 tries', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'flaky.test.js': `
				describe('A suite', () => {
					it.flaky('should retry this test', async ({}) => {
						console.log('FLAKE')
						throw new Error('flaked')
					})
				})
			`
		})
		assert(results.exitCode === 1)
		assert.equal(results.output.split('FLAKE\n').length - 1, 3)
	})

	it('should fail flaky suite after 3 tries', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'flaky.test.js': `
				describe.flaky('A suite', () => {
					it('should retry this test', async ({}) => {
						console.log('FLAKE')
						throw new Error('flaked')
					})
				})
			`
		})
		assert(results.exitCode === 1)
		assert.equal(results.output.split('FLAKE\n').length - 1, 3)
	})
})
