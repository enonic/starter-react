// Transpiles nashorn polyfill from among other things, npm libraries.

const path = require('path');

const { SRC_R4X, BUILD_R4X, BUILD_ENV } = require('./webpack.config.constants');

module.exports = {
    mode: BUILD_ENV,

    entry: {
        'nashornPolyfills': path.join(SRC_R4X, '_nashornPolyfills_.es6')
    },

    output: {
        path: BUILD_R4X,
        filename: "[name].js",
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
};
