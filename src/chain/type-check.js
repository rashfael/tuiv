// extract some prototypes to `instanceof` against
const { ElementHandle } = require('playwright/lib/client/elementHandle')
const { Frame } = require('playwright/lib/client/frame')
const { Page } = require('playwright/lib/client/page')
const { JsHandle } = require('playwright/lib/client/jsHandle')

function typeOf (thing) {
	// playwright types
	if (thing instanceof ElementHandle) return 'element'
	if (thing instanceof Frame || thing instanceof Page) return 'frame'
	if (thing instanceof JsHandle) return 'jshandle'
	if (Array.isArray(thing)) {
		// if (thing.every(i => i instanceof ElementHandle)) return 'array[element]'
		return 'array'
	}
	return typeof thing
}

module.exports.typeOf = typeOf
