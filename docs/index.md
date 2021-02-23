---
home: true
heroText: schauspiel
tagline: e2e browser testing based on playwright and folio
---

# Goals and Design

Schauspiel wants to enable you to write tests like this:

```js
describe('checkout', () => {
	it('should sucessfully checkout', async ({ page }) => {
		await page.goto('/')
		await page.get('.some .selector')
			.click()
			.type('typing some text')
			.should.not.have.class('empty')
		await page.get('.non-existing').should.not.exist()
	})
})
```

Schauspiel aims to:

- provide a chaining syntax based on native async/await
- use modern browser automation for all browsers via [playwright](https://playwright.dev/)
- auto-retrying everything
- a fixture based test runner thanks to [folio](https://github.com/microsoft/folio)

Schauspiel achieves this with [proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Lots and lots of proxies.

# Differences to other tools

## Playwright

**Schauspiel** builds heavily upon playwright and extends it with a more compact syntax.
Instead of handling all the promises yourself in playwright like this:

```js
const element = await page.waitForSelector('.some-selector')
await element.click()
await element.type('foo')
expect(await element.textContent()).stringContaining('bar')
```

schauspiel allows you to write chained commands and assertions, removing the need for a lot of local variables:

```js
await page.get('.some-selector').click().type('foo').should.contain.text('bar')
```

Schauspiel also auto-retries assertions and provides more assertions specifically for DOM elements.


## Cypress

Cypress is a clear inspiration for **schauspiel** and while Cypress remains a great and polished tool for e2e testing, it has some big caveats.

### Reliance on JS-injections

Instead of controlling the browser via an automation API (like playwright does), Cypress injects javascript into the pages it tests. This has some rather big shortcomings, chief of which is that *all* events are simulated inside javascript and thus only approximate real browser behavior. One consequence of this is [missing hover support](https://github.com/cypress-io/cypress/issues/10).


### Own async-to-sync API

Testing in the browser is inherently asynchronous. Waiting for pages to load, elements to exist and assertion conditions to be true need to all be handled. While playwright leaves this completely to the test author (resulting in *a lot* of `await`), Cypress completely hides this asynchronicity and presents the test author with a synchronous API, which, on first glance, is awesome. However, this forcing of asynchronous into synchronous call chains makes controlling the test flow (for [conditional testing](https://docs.cypress.io/guides/core-concepts/conditional-testing.html) for example) difficult ([fallbacks](https://docs.cypress.io/api/commands/then.html) exist) and some parts of Cypress' API a bit [bizarre](https://docs.cypress.io/api/commands/its.html).

**Schauspiel** instead relies on native Promises and Proxies, letting the test author write standard js.

### Browser Support

Cypress just added Firefox support and still does not support Safari, which makes its use as a cross platform testing tool severely limited.


### Assorted Nitpicks

From an outside perspective it looks like Cypress development is not fixing core problems but expanding into new use cases (with Cypress Studio for example).
Some long time problems I have while writing cypress tests are in no particular order:

- each test suite is a separate test run
- no way to stop on error in interactive mode
- iframes are complicated™
- weird `should('have.class', 'myclass')` syntax
- no window/tab support
