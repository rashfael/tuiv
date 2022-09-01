#!/usr/bin/env node
const packageJSON = require('../package.json')
const commander = require('commander')
const run = require('./run')

const program = new commander.Command()
program
	.version(packageJSON.version)
	.name('tuiv')

program
	.command('run <tests...>')
	.description('runs the specified tests')
	.option('--reports-dir <directory>', 'output directory', 'reports')
	.option('--reporters [reporters]', 'reporters, comma separated', 'spec')
	.option('-f, --headful', 'run in headful mode')
	.option('-p, --pause-on-error', 'pause on error, leaves the headful browser open')
	.option('-x, --exit-on-error', 'exits after encountering an error')
	.action(async (testsOpt, options, command) => {
		// const reporterOptions = {
		// 	outputDir: path.resolve(process.cwd(), options.reportsDir)
		// }
		// set config from cli options
		const config = {}
		for (const option of ['headful', 'pauseOnError', 'exitOnError']) {
			if (options[option]) {
				config[option] = options[option]
			}
		}
		const result = await run(testsOpt, {
			config,
			reporters: options.reporters
		})
		if (config.pauseOnError && result.stats.failed > 0) return
		process.exit(result.stats.failed === 0 ? 0 : 1)
	})

;(async () => {
	await program.parseAsync(process.argv)
})()
