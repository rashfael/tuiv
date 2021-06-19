---
home: true
heroText: tuiv
tagline: end-to-end browser testing based on playwright
actionText: Get Started
actionLink: /guide/getting-started
---

# tuiv enables you to write tests like this:

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

- provide a chaining command and assertion syntax based on native async/await
- use modern browser automation for all browsers via [playwright](https://playwright.dev/)
- auto-retry everything
- be a fixture based test runner

tuiv achieves this with [proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Lots and lots of proxies.
