var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: [
		path.join(__dirname, './src/main/resources/main.js')
	],
	module: {
		loaders: [{
			test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},{
				test: /\.less$/,
				loaders: ["style-loader", "css-loader", "less-loader"]
			}
		]
	},
	output: {
		path: __dirname + './',
		filename: 'bundle.js'
	},
	devServer: {
		contentBase: __dirname + '/dist',
		historyApiFallback: true
	}
}