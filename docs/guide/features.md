# Feature Overview
## Anatomy of a test suite

This is what a test file in **tuiv** usually looks like:

```js
const { context } = require('tuiv')

const fixtures = context.extend()

fixtures.someFixture(async ({}, use) => {
	await use('imagine something real here')
})

const { describe, it, beforeEach } = fixtures.build()

describe('tuiv docs', () => { // ← a test suite
	beforeEach(async ({ page }) => { // ← a hook executing before each test
		await page.goto('https://tuiv.rash.codes/')
		// this could also be a fixture
	})
	it('should exist', async ({ page, someFixture }) => { // ← a test
		await page.get('#main-title') // ← a command
			.should.have.text('tuiv') // ← an assertion
		await page.get('.description')
			.should.contain.text('browser testing based on playwright')
		const gettingStartedButton = page.get('"Get Started"')
		await gettingStartedButton
			.should.have.attr('href')
			.equaling('/guide/getting-started')
		await gettingStartedButton
			.click()
		await page.evaluate('location.href')
			.should.equal('https://tuiv.rash.codes/guide/getting-started.html')
		await page.get('.non-existing')
			.should.not.exist()
	})
})
```

You will probably want to distribute test suites across multiple files, and perhaps extract fixture definitions into even more files. To see how a slightly larger test setup might look, have a look at THIS EXAMPLE THAT'S NOT READY YET.

tuiv provides to following parts to create tests for your webapp:

### Commands and Assertions

The biggest parts of each of your browser tests are **commands**, controlling what the browser should do, and **assertions**, checking what the browser has done. Both **commands** and **assertions** are accessible via the promise chain and start with the `page` object.

```js
await page.get('.selector').click().type('text').should.not.have.class('empty')
          └──────────────────┬─────────────────┘└──────────────┬──────────────┘
                         commands                          assertion
```

To learn more about commands and assertions, see the [commands](/api/commands) and [assertions](/api/assertions) API docs.

For a deep dive about why proxies, promises and chains instead of the API provided by playwright, read [Proxied Promise Chain](/guide/proxied-promise-chain)

### Test Runner

You can (and should) organize your browser commands and assertions into tests and test suites, which you can do in tuiv with a BDD-style syntax very similar to what [Jasmine](https://jasmine.github.io/index.html) or [Mocha](https://mochajs.org/) provide.

With `describe` you can define test suites. Suites can contain other suites, also defined with a nested `describe`, tests, and hooks.

`it` defines a test (or more precisely called a "spec", but who's counting) with fixtures as paramaters. Each test should be able to run independently of another.

Hooks allow you to share code between tests and prepare or clean up your testing environment. These hooks are available: `beforeAll`, `beforeEach`, `afterEach`, `afterAll`.

For more details on `describe`, `it` and other test runner features, see [Test Runner API](/api/test-runner)

### Fixtures

While it's totally possible to create test envirments with only suites and hooks, tuiv provides another API to prepare pieces of modular test pre-conditions. Fixtures, inspired by [pytest](https://docs.pytest.org/en/6.2.x/fixture.html#fixture) and [folio](https://github.com/microsoft/folio), focus setup and teardown of a test enviroment on smaller, sharable, and composable test parameters.

Fixtures are created by first extending a tuiv context.

```js
const fixtures = context.extend()
```

To create fixtures you then declare them onto the fixture object with a function-based api.

```js
fixtures.aFixture(async ({}, use) => {
	// setup here
	await use(/* pass your fixture to tests here */)
	// teardown here
})
```

And finally, finish fixture declaration by building a new context, which provides you with the bdd-style test runner API. Building the fixtures also checks if you have created any circular dependencies.

```js
const { describe, it, beforeEach } = fixtures.build()
```

Fixtures can then be used in tests (and other fixtures) by object-destructuring the first argument passed to the test function.

```js
it('should exist', async ({ aFixture }) => {
	aFixture.explode()
})
```

To learn more about fixtures, see the [fixtures API docs](/api/fixtures).
