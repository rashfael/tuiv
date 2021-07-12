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

	it('should detect cyclical dependencies', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'a.test.js': `
				const fixtures = extend()
				fixtures.aFixture(async ({cFixture}, run) => {
				})

				fixtures.bFixture(async ({aFixture}, run) => {
				})

				fixtures.cFixture(async ({bFixture}, run) => {
				})

				;({ describe, it } = fixtures.build())

				describe('A test suite with fixtures', () => {
					it('test', async ({}) => {
					})
				})
			`
		})
		assert.equal(results.exitCode, 1)
		assert(results.output.includes('cyclical'))
	})

	it('should run fixtures in hooks and share fixtures', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'a.test.js': `
				const _aFixture = {
					setupCount: 0,
					teardownCount: 0
				}
				const fixtures = extend()
				fixtures.aFixture(async ({}, run) => {
					_aFixture.setupCount++
					await run(_aFixture)
					_aFixture.teardownCount++
				})

				;({ describe, it, beforeEach, afterEach } = fixtures.build())

				describe('A test suite with fixtures', () => {
					beforeEach(async ({aFixture}) => {
						assert.equal(aFixture.setupCount, 1)
						assert.equal(aFixture.teardownCount, 0)
					})
					it('check fixture setup', async ({aFixture}) => {
						assert.equal(aFixture.setupCount, 1)
						assert.equal(aFixture.teardownCount, 0)
					})
					afterEach(async ({aFixture}) => {
						assert.equal(aFixture.setupCount, 1)
						assert.equal(aFixture.teardownCount, 0)
					})
				})
			`
		})
		assert.equal(results.exitCode, 0)
	})

	it('should inherit fixtures', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'a.test.js': `
				let fixtures = extend()

				fixtures.aFixture(async ({}, run) => {
					run({inheritanceCount: 0})
				})

				fixtures = fixtures.build().extend()

				// allow overwrites without extending
				fixtures.aFixture(async ({aFixture}, run) => {
					aFixture.inheritanceCount++
					run(aFixture)
				})

				fixtures.aFixture(async ({aFixture}, run) => {
					aFixture.inheritanceCount++
					run(aFixture)
				})

				;({ describe, it } = fixtures.build())

				describe('A test suite with fixtures', () => {
					it('test', async ({aFixture}) => {
						assert(aFixture.inheritanceCount, 2)
					})
				})
			`
		})
		assert.equal(results.exitCode, 0)
	})

	it('should not share test-scoped fixtures', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'a.test.js': `
				let fixtures = extend()

				fixtures.aFixture(async ({}, run) => {
					run({shared: false})
				})

				;({ describe, it } = fixtures.build())

				describe('A test suite with fixtures', () => {
					it('test', async ({aFixture}) => {
						assert(!aFixture.shared)
						aFixture.shared = true
					})
					it('test', async ({aFixture}) => {
						assert(!aFixture.shared)
					})
				})
			`
		})
		assert.equal(results.exitCode, 0)
	})

	it('should share worker-scoped fixtures', async ({runVirtualTests}) => {
		const results = await runVirtualTests({
			'a.test.js': `
				let fixtures = extend()

				fixtures.aFixture(async ({}, run) => {
					run({shared: false})
				}, {scope: 'worker'})

				;({ describe, it } = fixtures.build())

				describe('A test suite with fixtures', () => {
					it('test', async ({aFixture}) => {
						assert(!aFixture.shared)
						aFixture.shared = true
					})
					it('test', async ({aFixture}) => {
						assert(aFixture.shared)
					})
				})
			`
		})
		assert.equal(results.exitCode, 0)
	})
	// should restart worker fixtures
	// should run fixtures in *All hooks?
})
