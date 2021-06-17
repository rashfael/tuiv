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
	const actionHandlers = {
		run: handleRun
	}
	if (actionHandlers[message[0]] !== undefined) {
		actionHandlers[message[0]](message[1])
	}
})

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
	while (specIdParts.length > 1) {
		suite = suite.suites[specIdParts.shift()]
	}
	const specIndex = Number(specIdParts.shift())
	const spec = suite.specs[specIndex]
	const hookError = await runHooks(suite, ['beforeAll', 'beforeEach'])
	if (!hookError) {
		try {
			await spec.fn(await resolveFixtures(spec))
			process.send(['testEnd', {status: 'passed'}])
		} catch (error) {
			process.send(['testEnd', {status: 'failed', error: serializeError(error)}])
		}
	}
	// dont run afterEach when beforeAll failed
	if (!hookError || hookError.type !== 'beforeAll') {
		await runHooks(suite, ['afterEach'])
	}
	// run afterAll only after last test in suite
	if (specIndex === suite.specs.length - 1) {
		await runHooks(suite, ['afterAll'])
	}
	// TODO teardown fixtures for hooks
	await teardownFixtures()
	// if (hookError) process.exit(0)
	process.send(['done'])
}

const finishedGlobalHooks = []
async function runHooks (suite, hookTypes) {
	// TODO run parent suite hooks
	const hooks = suite.hooks
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

async function teardownFixtures () {
	for (const fixture of activeFixtures) {
		fixture.teardownFn?.()
		await fixture.fnPromise
		fixture.instance = null
	}
	activeFixtures.clear()
}
