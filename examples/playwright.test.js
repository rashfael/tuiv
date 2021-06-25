const { describe, it, wrap } = require('../src')

describe('tuiv docs', () => {
	it('should exist', async ({ page }) => {
		await page.goto('https://tuiv.rash.codes/')
		await page.get('#main-title')
			.should.have.text('tuiv')
		await page.get('.description')
			.should.contain.text('browser testing based on playwright')
		const gettingStartedButton = page.get('"Get Started"')
		await gettingStartedButton
			.should.have.attr('href')
			.equaling('/guide/getting-started')
		await gettingStartedButton
			.click()
		await page.evaluate('location.href')
			.should.equal('https://tuiv.rash.codes/guide/getting-started.html')
		await page.get('.non-existing')
			.should.not.exist()
		await page.get('.container')
			.find('.non-existing')
			.should.not.exist()
		await wrap(Promise.resolve({val: 'derp'})).val.should.equal('derp')
	})
})
