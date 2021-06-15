const assert = require('assert')
const { describe, it } = require('./fixtures')

describe('Fixtures', () => {
	it('should run with simple fixtures', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'a.test.js': `
				const assert = require('assert')
				const fixtures = extend()
				fixtures.aFixture(async ({}, run) => {
					await run('a fixture')
				})

				fixtures.bFixture(async ({}, run) => {
					await run('b fixture')
				})
				;({ describe, it } = fixtures.build())

				describe('A test suite with fixtures', () => {
					it('should handle a fixture', async ({aFixture}) => {
						assert(aFixture === 'a fixture')
					})

					it('should handle multiple fixtures', async ({aFixture, bFixture}) => {
						assert(aFixture === 'a fixture')
						assert(bFixture === 'b fixture')
					})

					it('should handle a fixture rename', async ({aFixture: myFixture}) => {
						assert(myFixture === 'a fixture')
					})
				})
			`
		})
		assert(results.exitCode === 0)
	})
})
