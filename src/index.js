const { folio: baseFolio } = require('./playwright-test')
const FrameProxy = require('./FrameProxy')
// make promises chainable

const builder = baseFolio.extend()

const BASE_URL = 'http://localhost:8880' // 'https://cockpit-stage.ax-semantics.com'

const wrapPage = function (page) {
	const goto = page.goto
	page.goto = function (url, options) {
		if (url.startsWith('http')) return goto.call(this, url, options)
		return goto.call(this, BASE_URL + url, options)
	}
	return FrameProxy(null, page)
}

builder.page.override(async ({ page }, runTest) => {
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
	await runTest(wrapPage(page))
})

const folio = builder.build()

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
	wrapPage
}
