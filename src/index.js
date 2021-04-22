const { config } = require('./config')
// const { folio: baseFolio } = require('./playwright-test')
const FrameProxy = require('./FrameProxy')
const ValueProxy = require('./ValueProxy')
const JsHandleProxy = require('./JsHandleProxy')
const { rootContext } = require('./test-runner/context')

// const TestBuilder = {
// 	describe,
// 	it,
// 	beforeEach,
// 	beforeAll,
// 	afterEach,
// 	afterAll,
// 	extend: b
// }
//
// const FixtureBuilder = {
// 	[…]: {
// 		init,
// 		override
// 	},
// 	build: abaseContext
// }

// const builder = baseFolio.extend()

const wrap = function (valuePromise) {
	return ValueProxy(null, valuePromise)
}

const wrapPage = function (page) {
	const goto = page.goto
	page.goto = function (url, options) {
		console.log('GOTO', config)
		if (url.startsWith('http')) return goto.call(this, url, options)
		return goto.call(this, config.baseUrl + url, options)
	}
	return FrameProxy(null, page)
}

const wrapJsHandle = function (jsHandle) {
	return JsHandleProxy(null, jsHandle)
}

// builder.page.override(async ({ page }, runTest) => {
// 	// page.on('pageerror', exception => {
// 	// 	console.log(`Uncaught exception: "${exception}"`)
// 	// })
// 	//
// 	// page.on('requestfailed', request => {
// 	// 	console.log(request.url() + ' ' + request.failure().errorText)
// 	// })
// 	//
// 	// page.on('console', msg => console.log(msg.text()))
// 	// page.on('framenavigated', frame => {
// 	// 	if (frame !== page.mainFrame()) return
// 	// 	console.log('NAV', frame.url())
// 	// })
// 	await runTest(wrapPage(page))
// })
//
// const folio = builder.build()

module.exports = {
	context: rootContext,
	// folio,
	// it: folio.it,
	// fit: folio.fit,
	// xit: folio.xit,
	// test: folio.test,
	// describe: folio.describe,
	// beforeEach: folio.beforeEach,
	// afterEach: folio.afterEach,
	// beforeAll: folio.beforeAll,
	// afterAll: folio.afterAll,
	// expect: folio.expect,
	wrap,
	wrapPage,
	wrapJsHandle
}
