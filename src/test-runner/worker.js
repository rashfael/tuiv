const { config, writeConfig } = require('../config')
const { rootSuite } = require('./context')
const { serializeError } = require('./util')

process.noDeprecation = true // HACK shut up playwright deprecation for now https://github.com/microsoft/playwright/issues/6026

// process.on('disconnect', gracefullyCloseAndExit)
// process.on('SIGINT', () => {})
// process.on('SIGTERM', () => {})

// process.on('unhandledRejection', (reason, promise) => {
// })
//
// process.on('uncaughtException', error => {
// })

process.on('message', async message => {
	const actionHandlers = {
		init: init,
		run: handleRun,
		destroy: handleWorkerDestroy
	}
	if (actionHandlers[message[0]] !== undefined) {
		actionHandlers[message[0]](message[1])
	}
})

async function init ({config}) {
	writeConfig(config)
	process.send(['ready'])
}

const loadedPaths = {}
const activeFixtures = new Set()

// events should fire in this order:
// suiteStart
// hookStart(beforeAll)
// hookEnd(beforeAll)
// testStart
// hookStart(beforeEach)
// hookEnd(beforeEach)
// hookStart(afterEach)
// hookEnd(afterEach)
// testEnd
// hookStart(afterAll)
// hookEnd(afterAll)
// suiteEnd

// afterEach and afterAll should still run if beforeEach or a test fails
// only afterAlls on the same level or above should run if beforeAll fails
// if a beforeEach or afterEach fails, the test should also fail
// if a beforeAll or afterAll fails, all tests on the same level or below should fail

async function handleRun ({test}) {
	// console.log('SHOULD RUN', test)
	let suite
	if (!(suite = loadedPaths[test.filepath])) {
		suite = rootSuite.loadFile(test.filepath)
		loadedPaths[test.filepath] = suite
	}
	const specIdParts = test.specId.split(':')
	const parentSuites = []
	while (specIdParts.length > 1) {
		parentSuites.push(suite)
		suite = suite.suites[specIdParts.shift()]
	}
	parentSuites.shift() // remove rootSuite again
	const specIndex = Number(specIdParts.shift())
	const spec = suite.specs[specIndex]
	const hookError = await runHooks([...parentSuites, suite], ['beforeAll', 'beforeEach'])
	let testError
	if (!hookError) {
		try {
			await spec.fn(await resolveFixtures(spec))
			process.send(['testEnd', {status: 'passed'}])
		} catch (error) {
			testError = error
			process.send(['testEnd', {status: 'failed', error: serializeError(error)}])
		}
	}
	// dont run afterEach when beforeAll failed
	if (!hookError || hookError.type !== 'beforeAll') {
		await runHooks([suite, ...parentSuites.slice().reverse()], ['afterEach'])
	}
	// find afterAll hooks
	// assume a suite's own specs are always run before a subsuite's specs
	// if our suite has other sub suites with specs, no afterAll hooks need to run
	if (!suite.suites.some(suiteHasSpecs)) {
		const afterAllSuites = []
		// run own afterAlls if this test was the last one
		if (specIndex === suite.specs.length - 1) {
			afterAllSuites.push(suite)
		}
		// run a suite's afterAll hooks if the spec path is the last spec or suite for that suite
		const suites = parentSuites.slice()
		const suitePath = test.specId.split(':')
		suitePath.splice(0, 1) // remove root suite index
		suitePath.reverse()
		suitePath.splice(0, 1) // remove spec index
		for (const idPart of suitePath) {
			const suite = suites.pop()
			if (Number(idPart) === suite.suites.length - 1) {
				afterAllSuites.push(suite)
			}
		}
		await runHooks(afterAllSuites, ['afterAll'])
	}

	if (!(config.pauseOnError && (testError || hookError))) {
		await teardownFixtures()
		process.send(['done'])
	}
	// if (hookError) process.exit(0)
}

const finishedGlobalHooks = []
async function runHooks (suites, hookTypes) {
	// TODO run parent suite hooks
	const hooks = suites
		.map(suite => suite.hooks)
		.flat()
		.filter(hook => hookTypes.includes(hook.type) && !finishedGlobalHooks.includes(hook))
		.sort((a, b) => b.type.endsWith('All') - a.type.endsWith('All'))
	for (const hook of hooks) {
		try {
			if (hook.type.endsWith('All')) finishedGlobalHooks.push(hook)
			await hook.fn(await resolveFixtures(hook))
			process.send(['hookEnd', {status: 'passed'}])
		} catch (error) {
			process.send(['hookEnd', {type: hook.type, status: 'failed', error: serializeError(error)}])
			return {error, type: hook.type}
		}
	}
}

async function handleWorkerDestroy () {
	await teardownFixtures()
	await teardownFixtures('worker')
	process.exit()
}

function buildFixtureSetupOrder (spec) {
	// cyclicality already checked on context build time
	const setupOrder = []
	const visit = function (specOrFixture) {
		if (setupOrder.includes(specOrFixture)) return
		(specOrFixture.fixtures || specOrFixture.dependencies).forEach(visit)
		if (specOrFixture !== spec) setupOrder.push(specOrFixture)
	}
	visit(spec)
	return setupOrder
}

async function resolveFixtures (spec) {
	const fixtureSetupOrder = buildFixtureSetupOrder(spec)
	const fixtureObj = {}
	for (const fixture of fixtureSetupOrder) {
		await new Promise((resolve, reject) => {
			// fixture already instanced
			if (fixture.instance) {
				fixtureObj[fixture.name] = fixture.instance
				resolve()
				return
			}
			fixture.fnPromise = fixture.fn(fixtureObj, fixtureInstance => {
				fixture.instance = fixtureInstance
				fixtureObj[fixture.name] = fixtureInstance
				activeFixtures.add(fixture)
				resolve()
				return new Promise(resolve => fixture.teardownFn = resolve)
			})
			fixture.fnPromise.catch(error => {
				// this should only get forwarded when resolve is not already called by the fixture calling the run function
				reject(error)
			})
		})
	}
	return fixtureObj
}

async function teardownFixtures (scope) {
	for (const fixture of activeFixtures) {
		if (fixture.scope === 'worker' && scope !== 'worker') continue
		fixture.teardownFn?.()
		await fixture.fnPromise
		fixture.instance = null
		activeFixtures.delete(fixture)
	}
}

function suiteHasSpecs (suite) {
	if (suite.specs.length > 0) return true
	return suite.suites.some(suiteHasSpecs)
}
