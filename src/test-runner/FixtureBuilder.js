const parser = require('@babel/parser')

function getFunctionFixtures (fn) {
	const expression = parser.parseExpression(fn.toString())
	const isAsync = expression.async
	const fixtureParam = expression.params[0]
	if (!fixtureParam) return []
	if (fixtureParam.type !== 'ObjectPattern') throw new Error('first argument of function must be an object destructuring pattern')
	const fixtureProps = fixtureParam.properties.map(prop => prop.key.name)
	return fixtureProps
}

module.exports.getFunctionFixtures = getFunctionFixtures

module.exports.FixtureBuilder = function (context, parentFixtures) {
	const fixtures = new Map(parentFixtures)
	const createFixture = function (name, fn, options) {
		const fixture = {
			name,
			scope: options?.scope || 'test',
			fn,
			super: fixtures.get(name),
			dependencies: getFunctionFixtures(fn),
			fnPromise: null, // promise returned from fn, used to catch errors on setup/teardown
			instance: null, // gets set when instanced and unset after teardown
			teardownFn: null // set when instanced and called on teardown
		}
		fixtures.set(name, fixture)
	}

	return new Proxy({
		build () {
			// resolve dependency names
			const resolveDependencies = function (fixture) {
				fixture.dependencies = fixture.dependencies.map(dependencyName => {
					if (dependencyName === fixture.name) {
						// super dependency is not part of the fixture list, resolve separately
						resolveDependencies(fixture.super)
						return fixture.super
					}
					if (typeof dependencyName === 'string') return fixtures.get(dependencyName)
					return dependencyName
				})
			}
			fixtures.forEach(resolveDependencies)
			// check for cyclical deps
			const visit = function (fixture) {
				if (fixture.visited) throw new Error(`cyclical fixture dependency detected at ${fixture.name}`)
				fixture.visited = true
				fixture.dependencies.forEach(visit)
				fixture.visited = undefined
			}
			// just run check from all fixtures
			fixtures.forEach(visit)

			return require('./context').Context(fixtures)
		}
	}, {
		get (target, property, receiver) {
			if (Reflect.has(target, property)) return Reflect.get(target, property, receiver)
			return (fixture, options) => createFixture(property, fixture, options)
		}
	})
}
