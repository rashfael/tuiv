#!/usr/bin/env node
const path = require('path')
const globby = require('globby')
const commander = require('commander')
const Runner = require('./test-runner/Runner')
const SpecReporter = require('./reporters/spec')

const { loadConfig } = require('./config')

const program = new commander.Command()
program.version('0.0.1')

program
	.command('run <tests>')
	.description('runs the specified tests')
	.action(async testsOpt => {
		await loadConfig()

		const paths = (await globby(testsOpt)).map(p => path.resolve(process.cwd(), p))

		const runner = new Runner(paths)
		for (const reporter of [SpecReporter]) {
			reporter(runner)
		}
		await runner.loadFiles()
		const result = await runner.run()
		process.exit(result.stats.failed === 0 ? 0 : 1)
	})

;(async () => {
	await program.parseAsync(process.argv)
})()
