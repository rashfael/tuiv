module.exports = function () {
	const fixtures = []
	const initFixture = function (name, fn, options) {

	}

	const overrideFixture = function (name, fn) {

	}

	return new Proxy({
		build () {
			return (require('./FixtureBuilder'))(fixtures)
		}
	}, {
		get (target, property, receiver) {
			return {
				init: (fn, options) => initFixture(property, fn, options),
				override: fn => overrideFixture(property, fn)
			}
		}
	})
}
