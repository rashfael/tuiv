# Reporter API

Reporters are a function which take the runner and options as arguments.
Reporters then listen to events on the runner.

```js

function Reporter (runner, options) {
	runner.on('runBegin', () => {

	})
}

```

# Runner Events

```
runBegin
runEnd
suiteBegin
suiteEnd
hookBegin
hookEnd
testBegin
testEnd
```
