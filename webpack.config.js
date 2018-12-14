var webpack = require('webpack');
var path = require('path');


module.exports = {
    entry: {
        'jsx/App': path.join(__dirname, './src/main/resources/app/App.jsx')
    },
    output: {
        path: path.join(__dirname, 'build/resources/main/assets/'),
        filename: "[name].js"
    },
    resolve: {
        extensions: ['.js', '.jsx', '.less']
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.less$/,
            loaders: ["style-loader", "css-loader", "less-loader"]
        }]
    },
}