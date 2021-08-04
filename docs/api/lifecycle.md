# Test Suite Lifecycle

The tuiv test runner executes suites and tests roughly like this pseudocode:

```js
function runSuite (suite)
	run beforeAll hooks of suite
	for each spec in suite
		run beforeEach hooks of suite and parent suites
		run spec
		run afterEach hooks of suite and parent suites
	for each subSuite in suite
		runSuite(subSuite)
	run afterAll hooks of suite

for each file
	for each suite in file
		runSuite(suite)

teardownWorkerScopedFixtures()
```
