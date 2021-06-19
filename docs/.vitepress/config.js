module.exports = {
	title: 'tuiv',
	description: 'e2e browser testing based on playwright and folio',
	themeConfig: {
		nav: [
			{text: 'Guide', link: '/guide/getting-started', activeMatch: '^/guide/'},
			{text: 'API', link: '/api/commands', activeMatch: '^/api/'},
			{text: 'Github', link: 'https://github.com/rashfael/tuiv'}
		],
		sidebar: {
			'/guide/': [{
				text: 'Getting Started', link: '/guide/getting-started',
			}, {
				text: 'Feature Overview', link: '/guide/features',
			}, {
				text: 'Proxied Promise Chain', link: '/guide/proxied-promise-chain'
			}, {
				text: 'Comparison with Others', link: '/guide/comparison'
			}, {
				text: 'Migration From Cypress', link: '/guide/migration-from-cypress'
			}],
			'/api/': [
				{text: 'API Reference', children: [
					{text: 'Test Runner', link: '/api/test-runner'},
					{text: 'Built-in Fixtures', link: '/api/fixtures'},
					{text: 'Commands', link: '/api/commands'},
					{text: 'Assertions', link: '/api/assertions'}
				]}
			]
		}
	}
}
