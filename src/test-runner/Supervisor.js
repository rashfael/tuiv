const path = require('path')
const { EventEmitter } = require('events')
const { fork } = require('child_process')

const MAX_WORKERS = 1

class WorkerClient extends EventEmitter {
	constructor () {
		super()
		this.state = 'free'
		this.process = fork(path.join(__dirname, 'worker.js'), {
			env: process.env,
			// stdio: ['inherit', 'inherit', 'inherit', 'ipc']
		})
		this.process.on('exit', () => this.emit('exit'))
		this.process.on('error', e => {})
		this.process.on('message', message => {
			const [event, ...params] = message
			if (event === 'testEnd') this.state = 'free'
			if (['testEnd'].includes(event) && params[0].status === 'failed') {

			}
			this.emit(event, this.test, ...params)
		})
	}

	async init () {
		this.process.send({ action: 'init', params: { workerIndex: this.index, ...this.runner._config } })
		await new Promise(resolve => this.process.once('message', resolve))
	}

	run (test) {
		this.state = 'running'
		this.test = test
		this.process.send(['run', {test}])
	}

	stop () {
		this.process.send({ action: 'stop' })
	}
}

module.exports = class Supervisor extends EventEmitter {
	constructor (executionPlan) {
		super()
		this.executionPlan = executionPlan
		this._workers = []
		this._queue = []
		this._allTestsQueued = false
	}

	async run () {
		for (const test of this.executionPlan.tests) {
			const worker = await this._getFreeWorker()
			this.emit('testStart', test)
			worker.run(test)
		}
		this._allTestsQueued = true
	}

	async _getFreeWorker () {
		if (this._workers.length < MAX_WORKERS) {
			const worker = new WorkerClient()
			this._workers.push(worker)
			worker.on('testEnd', (test, result) => {
				this._queue.pop()?.(worker) // pass the worker along to someone waiting
				test.result = result
				this.emit('testEnd', test)
				if (this._allTestsQueued && this._queue.length === 0) this.emit('done')
			})
			worker.on('exit', () => {
				const index = this._workers.indexOf(worker)
				if (index > 0) this._workers.splice(index, 1)
			})
			return worker
		} else {
			const worker = this._workers.find(w => w.state === 'free')
			if (worker) return worker
			return new Promise(resolve => this._queue.push(resolve))
		}
	}
}
