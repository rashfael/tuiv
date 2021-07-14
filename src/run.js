const path = require('path')
const globby = require('globby')
const { rootSuite } = require('./test-runner/context')
const Runner = require('./test-runner/Runner')

const reporters = {
	spec: require('./reporters/spec'),
	json: require('./reporters/json')
}

const { loadConfig, config } = require('./config')

module.exports = async function (testsPath, options) {
	rootSuite.reset()
	await loadConfig()
	const paths = (await globby(testsPath)).map(p => path.resolve(process.cwd(), p))
	const reporterOptions = {
		// outputDir: path.resolve(process.cwd(), options.reportsDir)
	}
	Object.assign(config, options.config)
	const runner = new Runner(paths)
	for (const reporter of (options.reporters ?? 'spec').split(',')) {
		reporters[reporter](runner, reporterOptions)
	}
	await runner.loadFiles()
	return await runner.run()
}
