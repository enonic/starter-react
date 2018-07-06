var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: [
		path.join(__dirname, './src/main/resources/app/index.js')
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
		path: path.join(__dirname, 'build/resources/main/assets/'),
		filename : "bundle.js"
	}
}