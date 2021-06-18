// wraps a provided object in the appropriate proxy
// tries to guess the correct proxy by using `instanceof`
const { config } = require('./config')
const FrameProxy = require('./FrameProxy')
const ValueProxy = require('./ValueProxy')
const JsHandleProxy = require('./JsHandleProxy')

// extract some prototypes to `instanceof` against
const { Page } = require('playwright/lib/client/page')
const { JsHandle } = require('playwright/lib/client/jsHandle')

module.exports = function (thing) {
	if (thing instanceof Page) {
		const goto = thing.goto
		// TODO put this in the frameProxy?
		thing.goto = function (url, options) {
			if (url.startsWith('http')) return goto.call(this, url, options)
			return goto.call(this, config.baseUrl + url, options)
		}
		return FrameProxy(null, thing)
	}
	if (thing instanceof JsHandle) {
		return JsHandleProxy(null, thing)
	}
	if (thing instanceof Promise) {
		return ValueProxy(null, thing)
	}
	return ValueProxy(null, Promise.resolve(thing))
}
