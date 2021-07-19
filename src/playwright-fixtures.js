// TODO control playwright context
const { chromium } = require('playwright')
const { config } = require('./config')
const wrap = require('./wrap')

module.exports = function (fixtures) {
	fixtures.browser(async ({}, run) => {
		const browser = await chromium.launch({
			headless: !config.headful
		})
		await run(browser)
		await browser.close()
	}, {scope: 'worker'})

	fixtures.newPage(async ({browser}, run) => {
		await run(async function () {
			const context = await browser.newContext({
				viewport: {width: 1920, height: 1080}
			})
			const page = await context.newPage()
			for (const blockedGlob of config.blocklist || []) {
				page.route(blockedGlob, route => route.abort())
			}
			return page
		})
	}, {scope: 'worker'})

	fixtures.page(async ({newPage}, run) => {
		// page.on('pageerror', exception => {
		// 	console.log(`Uncaught exception: "${exception}"`)
		// })
		//
		// page.on('requestfailed', request => {
		// 	console.log(request.url() + ' ' + request.failure().errorText)
		// })
		//
		// page.on('console', msg => console.log(msg.text()))
		// page.on('framenavigated', frame => {
		// 	if (frame !== page.mainFrame()) return
		// 	console.log('NAV', frame.url())
		// })
		const page = await newPage()
		await run(wrap(page))
		await page.close()
	})
}
