const assert = require('assert')
const { describe, it } = require('./fixtures')

describe('Hooks', () => {
	it('should run', async ({runVirtualTests}) => {
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
		assert(results.output.split('BEFORE EACH')[0].split('BEFORE ALL').length - 1 === 1)
		assert(results.output.split('BEFORE EACH').length - 1 === 2)
		assert(results.output.split('AFTER EACH').length - 1 === 2)
		assert(results.output.split('AFTER EACH')[2].split('AFTER ALL').length - 1 === 1)
		assert(results.exitCode === 0)
	})

	it('should fail test when beforeEach hook fails, but should still run other tests', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'hook.test.js': `
				let failedOnce = false
				describe('A suite', () => {
					beforeEach(async ({}) => {
						if (!failedOnce) {
							console.log('BEFORE FAIL')
							failedOnce = true
							throw new Error('Failed beforeEach hook')
						}
						console.log('BEFORE EACH')
					})
					it ('should run this test', async ({}) => {})
					it ('should run another test', async ({}) => {})
				})
			`
		})
		assert(results.output.split('BEFORE FAIL').length - 1 === 1)
		assert(results.output.split('BEFORE EACH').length - 1 === 1)
		assert(results.exitCode === 1)
		assert(results.output.includes('1 of 2 tests failed'))
		// TODO do this with a json report?
	})

	it('should fail test when afterEach hook fails, but should still run other tests', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'hook.test.js': `
				let failedOnce = false
				describe('A suite', () => {
					afterEach(async ({}) => {
						if (!failedOnce) {
							console.log('AFTER FAIL')
							failedOnce = true
							throw new Error('Failed afterEach hook')
						}
						console.log('AFTER EACH')
					})
					it ('should run this test', async ({}) => {})
					it ('should run another test', async ({}) => {})
				})
			`
		})
		assert(results.output.split('AFTER FAIL').length - 1 === 1)
		assert(results.output.split('AFTER EACH').length - 1 === 1)
		assert(results.exitCode === 1)
		assert(results.output.includes('1 of 2 tests failed'))
	})

	it('should fail all tests when beforeAll fails', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'hook.test.js': `
				describe('A suite', () => {
					beforeAll(async ({}) => {
						console.log('BEFORE FAIL')
						throw new Error('Failed beforeAll hook')
					})
					it ('should run this test', async ({}) => {})
					it ('should run another test', async ({}) => {})
				})
			`
		})
		assert(results.output.split('BEFORE FAIL').length - 1 === 1)
		assert(results.exitCode === 1)
		assert(results.output.includes('2 of 2 tests failed'))
	})

	// it('should fail all tests when afterAll fails', async ({runVirtualTests}) => {
	// 	const results = await runVirtualTests({
	// 		'hook.test.js': `
	// 			describe('A suite', () => {
	// 				afterAll(async ({}) => {
	// 					console.log('AFTER FAIL')
	// 					throw new Error('Failed afterAll hook')
	// 				})
	// 				it ('should run this test', async ({}) => {})
	// 				it ('should run another test', async ({}) => {})
	// 			})
	// 		`
	// 	})
	// 	console.log(results.output)
	// 	assert(results.output.split('AFTER FAIL').length - 1 === 1)
	// 	assert(results.exitCode === 1)
	// 	assert(results.output.includes('2 of 2 tests failed'))
	// })

	it('should run afterEach and afterAll when test fails', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'hook.test.js': `
				describe('A suite', () => {
					afterAll(async ({}) => {
						console.log('AFTER ALL')
					})
					afterEach(async ({}) => {
						console.log('AFTER EACH')
					})
					it ('should run this test', async ({}) => {
						throw new Error('Failed test')
					})
				})
			`
		})
		assert(results.output.split('AFTER ALL').length - 1 === 1)
		assert(results.output.split('AFTER EACH').length - 1 === 1)
		assert(results.exitCode === 1)
	})

	it('should run afterEach and afterAll when beforeEach fails', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'hook.test.js': `
				describe('A suite', () => {
					beforeEach(async ({}) => {
						console.log('BEFORE FAIL')
						throw new Error('Failed beforeEach hook')
					})
					afterAll(async ({}) => {
						console.log('AFTER ALL')
					})
					afterEach(async ({}) => {
						console.log('AFTER EACH')
					})
					it ('should run this test', async ({}) => {})
				})
			`
		})
		assert(results.output.split('BEFORE FAIL').length - 1 === 1)
		assert(results.output.split('AFTER ALL').length - 1 === 1)
		assert(results.output.split('AFTER EACH').length - 1 === 1)
		assert(results.exitCode === 1)
	})

	it('should run only afterAll when beforeAll fails', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'hook.test.js': `
				describe('A suite', () => {
					beforeEach(async ({}) => {
						console.log('BEFORE EACH')
					})
					beforeAll(async ({}) => {
						console.log('BEFORE FAIL')
						throw new Error('Failed beforeEach hook')
					})
					afterAll(async ({}) => {
						console.log('AFTER ALL')
					})
					afterEach(async ({}) => {
						console.log('AFTER EACH')
					})
					it ('should run this test', async ({}) => {})
				})
			`
		})
		console.log(results.output)
		assert(results.output.split('BEFORE FAIL').length - 1 === 1)
		assert(results.output.split('BEFORE EACH').length - 1 === 0)
		assert(results.output.split('AFTER ALL').length - 1 === 1)
		assert(results.output.split('AFTER EACH').length - 1 === 0)
		assert(results.exitCode === 1)
	})
})
