# Getting Started

## Installation

Install tuiv with npm or yarn. This will download and install playwright, which has some [System Requirements](https://playwright.dev/docs/intro/#system-requirements).

```bash
npm install --save-dev tuiv
```

## Create your first test

Create a test file (usually in a separate folder for tests).

#### tests/my-first.test.js
```js
const { describe, it } = require('tuiv')

describe('a thing', () => {
	it('should work', async ({ page }) => {
		await page.goto('/')
		// commands and assertions go here
	})
})
```


## Run tests

tuiv provides a cli, which you can run with `npx`.

```bash
npx tuiv run tests/*.test.js
```

To learn more about how to test your webapp with tuiv, continue on to [Feature Overview](/guide/features)
