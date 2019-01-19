const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const { SRC_R4X, BUILD_R4X, BUILD_ENV, LIBRARY_NAME } = require('./webpack.config.constants');

module.exports = {
    mode: BUILD_ENV,

    entry: {
        'Core': path.join(SRC_R4X, '_frontendCore_.es6'),
    },

    output: {
        path: BUILD_R4X,  // <-- Sets the base url for plugins and other target dirs. Note the use of {{assetUrl}} in index.html (or index.ejs).
        filename: "[name].[contenthash:9].js",
        libraryTarget: 'var', // 'var' would easier to use in pure-frontend, accessing exports like: React.[name].function() etc... But 'commonjs' makes chunks easier to use from nashorn.
        library: [LIBRARY_NAME, '[name]'],
    },

    resolve: {
        extensions: ['.es6', '.js', '.jsx']
    },
    devtool: (BUILD_ENV === 'production') ? false : 'source-map',
    module: {
        rules: [
            {
                // Babel for building static assets
                test: /\.((jsx?)|(es6))$/,
                exclude: /[\\/]node_modules[\\/]/,
                loader: 'babel-loader',
                query: {
                    compact: (BUILD_ENV === 'production'),
                },
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            template: path.join(SRC_R4X, 'core.json.ejs'),
            filename: path.join(BUILD_R4X, 'core.json')
        }),
    ],

    /*optimization: {
        splitChunks: {
            name: false,
            cacheGroups: {
                frontendCoreVendors: {
                    name: 'frontendCoreVendors',
                    enforce: true,
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: 100
                },
            }
        }
    } //*/
};
