const http = require('http')
const serveHandler = require('serve-handler')
const { context } = require('../src')

const fixtures = context.extend()

fixtures.testPage(async ({page}, run) => {
	const server = http.createServer(serveHandler)

	await new Promise(resolve => server.listen(0, resolve))
	console.log(server.address())
	await page.goto()
	await run(page)
})

module.exports = fixtures.build()
