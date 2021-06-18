const { describe, it } = require('../src')

describe('tuiv playwright', () => {
	it('should do things', async ({ page }) => {
		await page.goto('https://tuiv.rash.codes/')
		await page.get('#main-title').should.have.text('tuiv')
		await page.get('.description').should.contain.text('browser testing based on playwright')
		await page.get('.non-existing', {timeout: 5000}).should.not.exist()
	})
})
