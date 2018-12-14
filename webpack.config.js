const webpack = require('webpack');
const path = require('path');

const SRC_RES = path.join(__dirname, 'src/main/resources');
const BUILD_RES path.join(__dirname, 'build/resources/main');

module.exports = {
    entry: {
        'jsx/App': path.join(SRC_RES, 'app/App.jsx'),
        'ssr/bundle': path.join(SRC_RES, 'app.es6'),
        'ssr/client': path.join(SRC_RES, 'ssr.es6'),
    },
    output: {
        path: path.join(BUILD_RES, 'assets/'),
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