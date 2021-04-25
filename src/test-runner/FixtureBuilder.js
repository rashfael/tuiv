const parser = require('@babel/parser')

function getFunctionFixtures (fn) {
	const expression = parser.parseExpression(fn.toString())
	const isAsync = expression.async
	const fixtureParam = expression.params[0]
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
			dependencies: getFunctionFixtures(fn)
		}
		fixtures.set(name, fixture)
	}

	return new Proxy({
		build () {
			// TODO resolve dependencies
			return require('./context').Context(fixtures)
		}
	}, {
		get (target, property, receiver) {
			if (Reflect.has(target, property)) return Reflect.get(target, property, receiver)
			return (fixture, options) => createFixture(property, fixture, options)
		}
	})
}
