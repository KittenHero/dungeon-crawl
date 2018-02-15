const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, 'static'),
		publicPath: '/static/'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			include: path.join(__dirname, 'src')
		}]
	},
}
if (process.env.NODE_ENV == 'production')

	module.exports.plugins = [new webpack.optimize.UglifyJsPlugin({ compress: {warnings: false} })]
