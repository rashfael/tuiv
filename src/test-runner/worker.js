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

const loadedPaths = {}

async function handleRun ({test}) {
	// console.log('SHOULD RUN', test)
	let suite
	if (!(suite = loadedPaths[test.filepath])) {
		suite = rootSuite.loadFile(test.filepath)
		loadedPaths[test.filepath] = suite
	}
	const specIdParts = test.specId.split(':')
	while (specIdParts.length > 1) {
		suite = suite.suites[specIdParts.shift()]
	}
	const spec = suite.specs[specIdParts.shift()]
	// console.log(spec)
	await runHooks(suite, ['beforeAll', 'beforeEach'])

	try {
		await spec.fn(await resolveFixtures(spec))
		process.send(['testEnd', {status: 'passed'}])
	} catch (error) {
		process.send(['testEnd', {status: 'failed', error: serializeError(error)}])
	}
	await runHooks(suite, ['afterAll', 'afterEach'])
	// process.exit(0)
}

const finishedGlobalHooks = []
async function runHooks (suite, hookTypes) {
	// TODO run parent suite hooks
	const hooks = suite.hooks
		.filter(hook => hookTypes.includes(hook.type) && !finishedGlobalHooks.includes(hook))
		.sort((a, b) => b.type.endsWith('All') - a.type.endsWith('All'))
	for (const hook of hooks) {
		try {
			await hook.fn(await resolveFixtures(hook))
			if (hook.type.endsWith('All')) finishedGlobalHooks.push(hook)
			process.send(['hookEnd', {status: 'passed'}])
		} catch (error) {
			process.send(['hookEnd', {status: 'failed', error: serializeError(error)}])
		}
	}
}

async function resolveFixtures (spec) {
	const fixtureObj = {}
	return Promise.all(spec.fixtures.map(fixture => {
		return new Promise(resolve => {
			let teardownCb
			fixture.fn({}, fixtureInstance => {
				fixtureObj[fixture.name] = fixtureInstance
				resolve()
				return new Promise(resolve => teardownCb = resolve)
			})
		})
	})).then(() => fixtureObj)
}
