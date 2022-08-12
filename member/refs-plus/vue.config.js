const path = require('path')
function resolve(dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	// 配置路径别名
	configureWebpack: {
		devServer: {
			port: 9019,
			// 调试时允许内网穿透，让外网的人访问到本地调试的H5页面
			disableHostCheck: true
		}
	},
	chainWebpack: config => {
		config.resolve.alias
			.set('@$', resolve('src'))
	}
	//productionSourceMap: false,
}
