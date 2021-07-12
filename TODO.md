- config file with base url, viewport, etc
- commands ?
- debug printing steps
- catch browser exceptions
- network blacklist
- stay open on error: currently needs patch for folio

- `should.be.visible` ?
- on type, if element not focused, emit click, just like cypress?

- hook naming https://mochajs.org/#describing-hooks

- handle cli termination

# features
retries asserts

patched folio workerRunner.ts _reportDoneAndStop `if (this._isStopped || this._failedTestId || this._fatalError)`
