# Getting Started

## Anatomy of a test suite

This is what a test suite in **tuiv** usually looks like:

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

### Test Runner

With `describe` you can define test suites and their lifecycle. You can also nest `describe` calls.

`it` defines a test with fixtures as paramaters. For more details on `describe`, `it` and other test runner features, have a look at the [Folio Documentation](https://github.com/microsoft/folio).

### Commands and Assertions

The biggest parts of each of your browser tests are **commands**, controlling what the browser should do, and **assertions**, checking what the browser has done. Both **commands** and **assertions** are accessible via the promise chain and start with the `page` object.

```js
await page.get('.selector').click().type('text').should.not.have.class('empty')
          └──────────────────┬─────────────────┘└──────────────┬──────────────┘
                         commands                          assertion
```

To learn more about the promise chain, read [Proxied Promise Chain](/guide/proxied-promise-chain)
