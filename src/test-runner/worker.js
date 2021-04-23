const { rootSuite } = require('./context')
const { serializeError } = require('./util')
// process.on('disconnect', gracefullyCloseAndExit)
// process.on('SIGINT', () => {})
// process.on('SIGTERM', () => {})

// process.on('unhandledRejection', (reason, promise) => {
// })
//
// process.on('uncaughtException', error => {
// })

process.on('message', async message => {
	// console.log(message)
	const actionHandlers = {
		run: handleRun
	}
	if (actionHandlers[message[0]] !== undefined) {
		actionHandlers[message[0]](message[1])
	}
})

async function gracefullyCloseAndExit () {
	process.exit(0)
}

async function handleRun ({test}) {
	// console.log('SHOULD RUN', test)
	rootSuite.loadFile(test.filepath)
	let suite = rootSuite.files[0]
	const specIdParts = test.specId.split(':')
	while (specIdParts.length > 1) {
		suite = suite.suites[specIdParts.shift()]
	}
	const spec = suite.specs[specIdParts.shift()]
	// console.log(spec)
	try {
		await spec.fn()
		process.send(['testEnd', {status: 'passed'}])
	} catch (error) {
		process.send(['testEnd', {status: 'failed', error: serializeError(error)}])
	}

	// process.exit(0)
}

function runTest(test, spec) {

}
