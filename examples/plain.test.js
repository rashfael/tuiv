const { describe, it } = require('./setup')

describe('A plain js test suite', () => {
	it ('should run this test 1', async () => {
	})

	it ('should run this test 2', async () => {
	})

	it ('should fail this test 3', async () => {
		throw new Error('AN ERROR')
	})

	it ('should run this test 4', async () => {
	})

	describe('A nested suite', () => {
		it ('should run this test 1.1', async () => {
		})

		it ('should run this test 1.2', async () => {
		})
	})
})
