// const { folio: baseFolio } = require('./playwright-test')
const { Context } = require('./test-runner/context')
const wrap = require('./wrap')
const fixtures = new Context().extend()

require('./playwright-fixtures')(fixtures)

const context = fixtures.build()

module.exports = {
	context,
	it: context.it,
	describe: context.describe,
	beforeEach: context.beforeEach,
	afterEach: context.afterEach,
	beforeAll: context.beforeAll,
	afterAll: context.afterAll,
	wrap
}
