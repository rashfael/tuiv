#!/usr/bin/env node
const path = require('path')
const globby = require('globby')
const commander = require('commander')
const Runner = require('./test-runner/Runner')

const reporters = {
	spec: require('./reporters/spec'),
	json: require('./reporters/json')
}

const { loadConfig, config } = require('./config')

const program = new commander.Command()
program.version('0.0.1')

program
	.command('run <tests...>')
	.description('runs the specified tests')
	.option('--reports-dir <directory>', 'output directory', 'reports')
	.option('--reporters [reporters]', 'reporters, comma separated', 'spec')
	.option('--headful', 'run in headful mode')
	.action(async (testsOpt, options, command) => {
		await loadConfig()

		const paths = (await globby(testsOpt)).map(p => path.resolve(process.cwd(), p))

		const reporterOptions = {
			outputDir: path.resolve(process.cwd(), options.reportsDir)
		}

		// set config from cli options
		if (options.headful) {
			config.headful = options.headful
		}
		const runner = new Runner(paths)
		for (const reporter of options.reporters.split(',')) {
			reporters[reporter](runner, reporterOptions)
		}
		await runner.loadFiles()
		const result = await runner.run()
		process.exit(result.stats.failed === 0 ? 0 : 1)
	})

;(async () => {
	await program.parseAsync(process.argv)
})()
