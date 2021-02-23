module.exports.methodsReturningNewElementHandle = [
	'$',
	'$$',
	'waitForSelector'
]

// https://github.com/microsoft/playwright/blob/master/src/client/elementHandle.ts#L138 stuff returning Promise<void>
module.exports.methodsChainingElementHandle = [
	'hover',
	'click',
	'dblclick',
	'tap',
	// 'selectOption' not really returning void, but useful?
	'fill',
	'selectText',
	'setInputFiles',
	'focus',
	'type',
	'press',
	'check',
	'uncheck'
]

module.exports.methodsReturningNewFrame = [
	'contentFrame'
]

module.exports.promiseKeys = Reflect.ownKeys(Promise)
module.exports.promiseInstanceKeys = Reflect.ownKeys(Promise.prototype)
