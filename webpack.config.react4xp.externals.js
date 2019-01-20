const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const { SRC_R4X, BUILD_R4X, BUILD_ENV } = require('./config.constants');

module.exports = {
    mode: BUILD_ENV,

    entry: {
        'externals': path.join(SRC_R4X, '_externals_.es6'),
    },

    output: {
        path: BUILD_R4X,  // <-- Sets the base url for plugins and other target dirs. Note the use of {{assetUrl}} in index.html (or index.ejs).
        filename: "[name].[contenthash:9].js",
    },

    resolve: {
        extensions: ['.es6', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.((jsx?)|(es6))$/,
                exclude:  /node_modules/,
                loader: 'babel-loader',
                query: {
                    compact: (BUILD_ENV === 'production'),
                }
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            template: path.join(SRC_R4X, 'externals.json.ejs'),
            filename: path.join(BUILD_R4X, 'externals.json')
        }),
    ],
};
