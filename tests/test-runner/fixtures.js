const path = require('path')
const fs = require('fs/promises')
const { spawn } = require('child_process')
const { context } = require('../../src')

const fixtures = context.extend()

const VIRTUAL_ENV = path.join(__dirname, '../../virtual-tests')
const HEADER = `
	const assert = require('assert')
	const { context } = require('${path.join(VIRTUAL_ENV, '../src')}')
	let { extend, describe, it, beforeAll, beforeEach, afterAll, afterEach } = context
`

fixtures.runVirtualTests(async ({}, run) => {
	await run(async (files, {params, timeout} = {params: []}) => {
		await fs.rm(VIRTUAL_ENV, {recursive: true, force: true})
		for (let [testpath, content] of Object.entries(files)) {
			testpath = path.join(VIRTUAL_ENV, testpath)
			await fs.mkdir(path.dirname(testpath), {recursive: true})
			await fs.writeFile(testpath, HEADER + content)
		}
		const tuivProcess = spawn('node', [
			path.join(__dirname, '../../src/cli.js'),
			'run',
			...params,
			`${VIRTUAL_ENV}/**/*.test.js`
		], {
			cwd: VIRTUAL_ENV
		})

		let output = ''
		let stderr = ''
		tuivProcess.stdout.on('data', data => {
			output += data
			if (process.env.TUIV_DEBUG) {
				console.log(String(data))
			}
		})
		tuivProcess.stderr.on('data', data => {
			output += data
			stderr += data
			if (process.env.TUIV_DEBUG) {
				console.log(String(data))
			}
		})
		if (timeout) {
			setTimeout(() => {
				tuivProcess.kill('SIGKILL')
			}, timeout)
		}
		const exitCode = await new Promise(resolve => tuivProcess.on('close', resolve))

		return {
			exitCode,
			output,
			stderr
		}
	})
})

module.exports = fixtures.build()
