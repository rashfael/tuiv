const assert = require('assert')
const { extend } = require('./setup')

const fixtures = extend()

fixtures.aFixture(async ({}, run) => {
	await run('a fixture')
})

fixtures.bFixture(async ({}, run) => {
	await run('b fixture')
})

const { describe, it } = fixtures.build()

describe('A test suite with fixtures', () => {
	it ('should handle a fixture', async ({aFixture}) => {
		assert(aFixture === 'a fixture')
	})

	it ('should handle multiple fixtures', async ({aFixture, bFixture}) => {
		assert(aFixture === 'a fixture')
		assert(bFixture === 'b fixture')
	})

	it ('should handle a fixture rename', async ({aFixture: myFixture}) => {
		assert(myFixture === 'a fixture')
	})
})
