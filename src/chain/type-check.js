// extract some prototypes to `instanceof` against
const path = require('path')
const playwrightPath = path.dirname(require.resolve('playwright-core/package.json'))
const { ElementHandle } = require(path.join(playwrightPath, './lib/client/elementHandle'))
const { Frame } = require(path.join(playwrightPath, './lib/client/frame'))
const { Page } = require(path.join(playwrightPath, './lib/client/page'))
const { JSHandle } = require(path.join(playwrightPath, './lib/client/jsHandle'))

function typeOf (thing) {
	// playwright types
	if (thing instanceof ElementHandle) return 'element'
	if (thing instanceof Frame || thing instanceof Page) return 'frame'
	if (thing instanceof JSHandle) return 'jshandle'
	if (Array.isArray(thing)) {
		// if (thing.every(i => i instanceof ElementHandle)) return 'array[element]'
		return 'array'
	}
	return typeof thing
}

module.exports.typeOf = typeOf
