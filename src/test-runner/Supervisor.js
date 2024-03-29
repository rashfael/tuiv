const path = require('path')
const { EventEmitter } = require('events')
const { fork } = require('child_process')
const { config } = require('../config')

const MAX_WORKERS = 1

class WorkerClient extends EventEmitter {
	constructor () {
		super()
		this.state = 'free'
		this.process = fork(path.join(__dirname, 'worker.js'), {
			env: process.env,
			// stdio: ['inherit', 'inherit', 'inherit', 'ipc']
		})
		this.process.on('exit', () => {
			if (this.state !== 'destroying') {
				this.emit('exit')
			}
		})
		this.process.on('error', e => {})
		this.process.on('message', message => {
			const [event, ...params] = message
			if (event === 'done') this.state = 'free'
			if (['testEnd'].includes(event) && params[0].status === 'failed') {
				// kill process?
			}
			this.emit(event, this.test, ...params)
		})
	}

	async init () {
		this.process.send(['init', {config}])
		await new Promise(resolve => this.process.once('message', resolve))
	}

	run (test) {
		this.state = 'running'
		this.test = test
		this.process.send(['run', {
			test: {
				filepath: test.filepath,
				specId: test.specId
			}
		}])
	}

	destroy () {
		this.state = 'destroying'
		let resolveCb
		const promise = new Promise(resolve => resolveCb = resolve)
		this.process.on('exit', resolveCb)
		this.process.send(['destroy'])
		return promise
	}
}

module.exports = class Supervisor extends EventEmitter {
	constructor (executionPlan) {
		super()
		this.executionPlan = executionPlan
		this._workers = []
		this._queue = []
		this._allTestsQueued = false
		this._cleanup = false
	}

	async run () {
		for (const test of this.executionPlan.tests) {
			const worker = await this._getFreeWorker()
			if (test.result) continue // test already got resolved (by failing hooks)
			this.emit('testStart', test)
			worker.run(test)
		}
		this._allTestsQueued = true
		if (this._workers.every(w => w.state === 'free')) this.doneAndCleanup()
	}

	async _getFreeWorker () {
		if (this._workers.length < MAX_WORKERS) {
			const worker = new WorkerClient()
			await worker.init()
			this._workers.push(worker)
			const markTestWithFailedHook = (test, hook) => {
				test.result = {
					status: 'failed',
					hookFail: hook.type
				}
				this.emit('testEnd', test)
			}
			worker.on('testEnd', (test, result) => {
				test.result = result
				if (test.retriesLeft && result.status === 'failed') return
				this.emit('testEnd', test)
			})
			worker.on('hookEnd', (test, hook) => {
				hook.test = test
				this.emit('hookEnd', hook)
				if (hook.status === 'failed') {
					markTestWithFailedHook(test, hook)
					if (hook.type.endsWith('All')) {
						// fail all remaining tests in suite
						for (const otherTest of this.executionPlan.tests) {
							// HACK actually check all suites
							if (!otherTest.result && otherTest.suites.includes(test.suites[0])) {
								markTestWithFailedHook(otherTest, hook)
							}
						}
						// TODO and subsuites!
					}
					// worker should die here after wrapping up hooks
				}
			})
			worker.on('exit', () => {
				const index = this._workers.indexOf(worker)
				if (index >= 0) this._workers.splice(index, 1)
				if (this._allTestsQueued && this._queue.length === 0) {
					this.doneAndCleanup()
				} else {
					const worker = new WorkerClient()
					this._workers.push(worker)
					this._queue.pop()?.(worker)
				}
			})
			worker.on('done', (test) => {
				if (config.pauseOnError && test.result.status === 'failed') {
					this.emit('done')
					return
				}
				if (test.retriesLeft && test.result.status === 'failed') {
					test.retriesLeft--
					worker.run(test)
					return
				}
				this._queue.pop()?.(worker) // pass the worker along to someone waiting
				if (this._allTestsQueued && this._queue.length === 0) this.doneAndCleanup()
			})
			return worker
		} else {
			const worker = this._workers.find(w => w.state === 'free')
			if (worker) return worker
			return new Promise(resolve => this._queue.push(resolve))
		}
	}

	async doneAndCleanup () {
		if (this._cleanup) return
		this._cleanup = true
		for (const worker of this._workers) {
			await worker.destroy()
		}
		this.emit('done')
	}
}
