const assert = require('assert')
const { describe, it } = require('./fixtures')

describe('Fixtures', () => {
	it('should run with simple fixtures', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'a.test.js': `
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
						assert.equal(aFixture, 'a fixture')
					})

					it('should handle multiple fixtures', async ({aFixture, bFixture}) => {
						assert.equal(aFixture, 'a fixture')
						assert.equal(bFixture, 'b fixture')
					})

					it('should handle a fixture rename', async ({aFixture: myFixture}) => {
						assert.equal(myFixture, 'a fixture')
					})
				})
			`
		})
		assert.equal(results.exitCode, 0)
	})
	it('should teardown fixture', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'a.test.js': `
				const _fixture = {
					teardownCount: 0
				}
				const fixtures = extend()
				fixtures.aFixture(async ({}, run) => {
					await run(_fixture)
					_fixture.teardownCount++
				})

				;({ describe, it } = fixtures.build())

				describe('A test suite with fixtures', () => {
					it('trigger teardown', async ({aFixture}) => {
					})
					it('check teardown', async ({aFixture}) => {
						assert.equal(aFixture.teardownCount, 1)
					})
				})
			`
		})
		assert.equal(results.exitCode, 0)
	})

	it('should teardown dependent fixture', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'a.test.js': `
				const _fixture = {
					teardownCount: 0
				}
				const fixtures = extend()
				fixtures.aFixture(async ({}, run) => {
					await run(_fixture)
					_fixture.teardownCount++
				})

				fixtures.bFixture(async ({aFixture}, run) => {
					await run()
				})

				;({ describe, it } = fixtures.build())

				describe('A test suite with fixtures', () => {
					it('trigger teardown', async ({bFixture}) => {
					})
					it('check teardown', async ({aFixture}) => {
						assert.equal(aFixture.teardownCount, 1)
					})
				})
			`
		})
		assert.equal(results.exitCode, 0)
	})

	it('should run with dependent fixtures', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'a.test.js': `
				const _aFixture = {
					setupCount: 0
				}
				const fixtures = extend()
				fixtures.aFixture(async ({}, run) => {
					_aFixture.setupCount++
					await run(_aFixture)
				})

				fixtures.bFixture(async ({aFixture}, run) => {
					assert.equal(aFixture.setupCount, 1)
					await run('b fixture')
				})

				;({ describe, it } = fixtures.build())

				describe('A test suite with fixtures', () => {
					it('check fixture setup', async ({aFixture, bFixture}) => {
						assert.equal(aFixture.setupCount, 1)
					})
				})
			`
		})
		assert.equal(results.exitCode, 0)
	})

	// should run fixtures in hooks

	// should run fixtures in *All hooks?

	// fixture scopes
})
