const { cosmiconfig } = require('cosmiconfig')

const config = {
	fudge: 'fudge'
	// baseUrl: ''
}

module.exports.config = config

module.exports.loadConfig = async function () {
	const explorer = cosmiconfig('tuiv')
	const loadedConfig = await explorer.search()
	if (loadedConfig) {
		Object.assign(config, loadedConfig.config)
	}
	// console.log('CONFIG:', config)
}
