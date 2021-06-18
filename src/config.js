const { cosmiconfig } = require('cosmiconfig')

const config = {
	// baseUrl: ''
}

module.exports.config = config

// should only be called from the main process, NOT from workers
module.exports.loadConfig = async function () {
	const explorer = cosmiconfig('tuiv')
	const loadedConfig = await explorer.search()
	if (loadedConfig) {
		Object.assign(config, loadedConfig.config)
	}
	// console.log('CONFIG:', config)
}

// call this from workers to make config available to code in worker
module.exports.writeConfig = function (newConfig) {
	Object.assign(config, newConfig)
}
