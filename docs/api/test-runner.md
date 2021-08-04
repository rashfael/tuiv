# Test Runner API

## tuiv

If you don't need to add your own fixtures, tuiv lets you import the BDD setup functions with the default fixtures loaded directly from the module.

```js
const {
	describe,
	it,
	beforeEach,
	beforeAll,
	afterEach,
	afterAll
} = require('tuiv')

describe('A test suite', () => {
	it('should run a test', async ({page}) => {
		// test here
	})
})
```

If you want own fixtures, you need to extend the default context and build your own.

```js
const { context } = require('tuiv')
const fixtures = context.extend()

fixtures.myFixture(async ({}, run) => {
	await run(/* your fixture here*/)
})

const {
	describe,
	it,
	beforeEach,
	beforeAll,
	afterEach,
	afterAll
} = fixtures.build()
```



### tuiv.context

The default [Context](#Context) with [built-in fixtures included](/api/fixtures).

### tuiv.wrap

```js
const { wrap } = require('tuiv')
await wrap({anything: 3}).anything.should.equal(3)
```

`wrap` takes any value or object and lets you run [commands](/api/commands) and [assertions](/api/assertions) off of it.

## Context

Tuiv contexts provide access to BDD setup functions.
New contexts can be created from any context by expanding it with additional fixtures.

### context.extend()

returns a new [FixtureBuilder](#FixtureBuilder) based on the current context. Inherits all fixtures of the current context.

### context.describe\[.only]\[.skip](title, suiteFunction)
- `title` *\<string\>* suite title
- `suiteFunction` *\<function\>* immediately called function. All other BDD setup functions called inside this function are added to the described suite.

Defines a test suite which can hold tests, hooks and other suites.
Can be modified with the modifiers `only` and `skip`.

### context\.it\[.only]\[.skip](title, testFunction)
- `testFunction` *<async function(Fixtures)>*
	- `Fixtures` *\<destructured object\>* fixtures used by this test. Must be a [destructured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) object.

### context.beforeEach(hookFunction)
### context.afterEach(hookFunction)
### context.beforeAll(hookFunction)
### context.afterAll(hookFunction)
- `hookFunction` *<async function(Fixtures)>*
	- `Fixtures` *\<destructured object\>* fixtures used by this hook. Must be a [destructured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) object.

## FixtureBuilder

### Adding fixtures

```js
const fixtures = context.extend()

fixtures.myFixture(async ({ otherFixture }, run) => {
	// fixture setup
	const myFixture = await otherFixture.something()
	// hand over fixture to test and run
	await run(myFixture)
	// fixture teardown
	myFixture.teardown()
})

const newContext = fixtures.build()
```

### fixtures.*FIXTURE_NAME*(fixtureSetupFunction[, options])

- `fixtureSetupFunction` *<async function(Fixtures, runCallback)>*
	- `Fixtures` *\<destructured object\>* other fixtures used by this fixture. Must be a [destructured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) object, just like fixture loading in test definitions.
	- `runCallback` *<async function(any)>* await this callback with your fixture as the parameter after you have finished setting up your fixture. After this callback has returned, teardown your fixture if needed.
- `options` *\<object\>*
	- `scope` *<"test"|"worker">* Specifies the scope of the fixture. `test`-scoped fixtures are setup and torn down before and after each test. `worker`-scoped fixtures are setup on first use and torn down when a worker has finished all tests. Defaults to `test`.

Adds a fixture with *FIXTURE_NAME* as name to the builder.
You can override fixtures by re-declaring the same *FIXTURE_NAME* and access the previous fixture by loading it as a dependent fixture.

### fixtures.build()

Resolves all added fixtures. Throws an error if any cyclical dependencies are found or returns a new [Context](#Context).
