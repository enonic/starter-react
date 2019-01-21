// Webpack for transpiling externals (aka vendors) chunk/asset file, for gathering up heavy and rarely-changed
// (and so, nicely cacheable) libs and dependencies - React etc.
// Basis for externals (affects other transpilations too): webpack.config.constants.json
//
// Output, externals.[contentHash].js, is content-hashed file name for cache busting, hash is stored for
// runtime reference in commonChunks.json.

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const { SRC_R4X, BUILD_R4X, BUILD_ENV } = require('./webpack.config.constants');

module.exports = {
    mode: BUILD_ENV,

    entry: {
        // Built during the gradle step that triggers this webpack step: webpack_r4xp_externals
        'externals': path.join(SRC_R4X, '_AUTOGENERATED_externals_.es6'),

        // TODO: nashorn polyfills don't need content hashing. This works for now, but should dispense with the whole frontend cache-busting-hash-in-the-filename and find-the-hashed-filename-through-chunkJsonFile. Can this be dispensed with without making yet another separate webpack step?
        'nashornPolyfills': path.join(SRC_R4X, '_nashornPolyfills_.es6')
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
            template: path.join(SRC_R4X, 'chunks.externals.json.ejs'),
            filename: path.join(BUILD_R4X, 'chunks.externals.json')
        }),

        // TODO: nashorn polyfills don't need content hashing. This works for now, but should dispense with the whole frontend cache-busting-hash-in-the-filename and find-the-hashed-filename-through-chunkJsonFile. Can this be dispensed with without making yet another separate webpack step?
        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            template: path.join(SRC_R4X, 'chunks.nashornPolyfills.json.ejs'),
            filename: path.join(BUILD_R4X, 'chunks.nashornPolyfills.json')
        }),
    ],
};
