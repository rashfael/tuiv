/**
 * Copyright Microsoft Corporation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { config, folio: baseFolio } = require('folio')

// Test timeout for e2e tests is 30 seconds.
config.timeout = 300000

const fixtures = baseFolio.extend()
fixtures.browserName.initParameter('Browser type name', (process.env.BROWSER || 'chromium'))
fixtures.headful.initParameter('Whether to run tests headless or headful', !!process.env.HEADFUL)
fixtures.platform.initParameter('Operating system', process.platform)
fixtures.screenshotOnFailure.initParameter('Generate screenshot on failure', false)
fixtures.slowMo.initParameter('Slows down Playwright operations by the specified amount of milliseconds', 0)
fixtures.video.initParameter('Record videos while running tests', false)

fixtures.browserOptions.init(async ({ headful, slowMo }, run) => {
	await run({
		handleSIGINT: false,
		slowMo,
		headless: !headful
	})
}, { scope: 'worker' })

fixtures.playwright.init(async ({ }, run) => {
	const playwright = require('playwright')
	await run(playwright)
}, { scope: 'worker' })

fixtures.browserType.init(async ({ playwright, browserName }, run) => {
	const browserType = playwright[browserName]
	await run(browserType)
}, { scope: 'worker' })

fixtures.browser.init(async ({ browserType, browserOptions }, run) => {
	const browser = await browserType.launch(browserOptions)
	await run(browser)
	// await browser.close()
}, { scope: 'worker' })

fixtures.isChromium.init(async ({ browserName }, run) => {
	await run(browserName === 'chromium')
}, { scope: 'worker' })

fixtures.isFirefox.init(async ({ browserName }, run) => {
	await run(browserName === 'firefox')
}, { scope: 'worker' })

fixtures.isWebKit.init(async ({ browserName }, run) => {
	await run(browserName === 'webkit')
}, { scope: 'worker' })

fixtures.isWindows.init(async ({ platform }, run) => {
	await run(platform === 'win32')
}, { scope: 'worker' })

fixtures.isMac.init(async ({ platform }, run) => {
	await run(platform === 'darwin')
}, { scope: 'worker' })

fixtures.isLinux.init(async ({ platform }, run) => {
	await run(platform === 'linux')
}, { scope: 'worker' })

fixtures.contextOptions.init(async ({ video, testInfo }, run) => {
	if (video) {
		await run({
			videosPath: testInfo.outputPath(''),
		})
	} else {
		await run({})
	}
})

fixtures.contextFactory.init(async ({ browser, contextOptions, testInfo, screenshotOnFailure }, run) => {
	const contexts = []
	async function contextFactory (options = {}) {
		const context = await browser.newContext({ ...contextOptions, ...options })
		contexts.push(context)
		return context
	}
	await run(contextFactory)

	if (screenshotOnFailure && (testInfo.status !== testInfo.expectedStatus)) {
		let ordinal = 0
		for (const context of contexts) {
			for (const page of context.pages())
				await page.screenshot({ timeout: 5000, path: testInfo.outputPath(`test-failed-${++ordinal}.png`) })
		}
	}
	if (testInfo.status !== testInfo.expectedStatus) return // don't close on fail
	for (const context of contexts)
		await context.close()
})

fixtures.context.init(async ({ contextFactory }, run) => {
	const context = await contextFactory()
	await run(context)
	// Context factory is taking care of closing the context,
	// so that it could capture a screenshot on failure.
})

fixtures.page.init(async ({ context }, run) => {
	// Always create page off context so that they matched.
	await run(await context.newPage())
	// Context fixture is taking care of closing the page.
})

fixtures.testParametersPathSegment.override(async ({ browserName, platform }, run) => {
	await run(browserName + '-' + platform)
})

const folio = fixtures.build()

module.exports = {
	folio,
	it: folio.it,
	fit: folio.fit,
	xit: folio.xit,
	test: folio.test,
	describe: folio.describe,
	beforeEach: folio.beforeEach,
	afterEach: folio.afterEach,
	beforeAll: folio.beforeAll,
	afterAll: folio.afterAll,
	expect: folio.expect,
}

// If browser is not specified, we are running tests against all three browsers.

// folio.generateParametrizedTests(
// 	'browserName',
// 	process.env.BROWSER ? [process.env.BROWSER] : ['chromium', 'webkit', 'firefox'])
