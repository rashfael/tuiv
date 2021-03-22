---
home: true
heroText: tuiv
tagline: e2e browser testing based on playwright and folio
actionText: Get Started
actionLink: /guide/getting-started
---

# Goals and Design

tuiv enables you to write tests like this:

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

tuiv aims to:

- provide a chaining syntax based on native async/await
- use modern browser automation for all browsers via [playwright](https://playwright.dev/)
- auto-retrying everything
- a fixture based test runner thanks to [folio](https://github.com/microsoft/folio)

tuiv achieves this with [proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Lots and lots of proxies.
