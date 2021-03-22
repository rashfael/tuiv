# Proxied Promise Chain

**Commands** and **assertions** in *tuiv* are issued in a chain.

## Commands

*tuiv* is based on playwright, here's what commands look like without a chain:

```js
const element = await page.waitForSelector('.selector')
await element.click()
await element.type('some text')
```

For single commands, we do not need a variable, but we still would need multiple awaits:

```js
await (await page.waitForSelector('.selector')).click()
```

With chains, we can get rid of multiple awaits and local variables and write our commands like this:

```js
await page.get('.selector').click().type('some text')
```

## Assertions

Playwright comes with `expect` style assertions:

```js
const alt = await page.getAttribute('input', 'alt')
expect(alt).toBe('Text')
```

with chains, we can lean even more into natural language looking assertions:

```js
await page.get('input').should.have.attr('alt').equaling('text')
```

You can go over board with the natural-ish language as much as you like:

```js
await page.get('input').should.have.an.attribute('alt').which.equals('text')
```

Or not at all:

```js
await page.get('input').should.attr('alt')('text')
```

The biggest difference between *tuiv*s assertions and playwrights though is retryability. *tuiv* will retry the whole chain, including re-fetching the attribute content and assert until the timeout is reached.

## Chain branches

*tuiv*s chains are branchable, so you don't need to hold back with any variables at all.

```js
const root = page.get('.my-root')
await root.find('.some-child').click()
await root.find('.some-other-child').type('some text')
```

Each chain will resolve on promise `await`.

## Benefits from using chains

- cleaner api
- less local variables and awaiting
- retry-ability

## How does it work?

Each chain starts at the `page` object, which is a playwright [Page](https://playwright.dev/docs/api/class-page) wrapped in a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Each call on the page in turn returns another proxy, which records all property accesses and function calls. Finally, the whole chain gets resolved at once when calling `then` at the end of the chain, which is what `await` does for us.
