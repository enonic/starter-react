// Webpack for transpiling user-added JS, primarily react JSX components: top-level or shared components, component libraries.
// Look mainy for JSX files in:
//
// - src/main/react4xp: Here, each file under /_entries/ will become a separate, top-level component/asset, and
// all other dependencies to those, in all other folders below react4xp, will be bundled into chunks by the name of
// the folder. Third-pardy dependencies in /node_modules/ will be separated out into a vendors bundle, except for externals,
// (based on webpack.config.constants.json .EXTERNALS).
//
// All such second-level assets will have content-hashed file names for cache busting, hashes are stored for
// runtime reference in commonChunks.json.
//
// - ...and in the XP structure under src/main/resources/site: Here, JSX files are more tightly bound to their corresponding
// XP component (part, page, etc) but can still use the second-level dependency chunks mentioned above.

const Chunks2json = require('chunks-2-json-webpack-plugin');
const entriesAndChunks = require('./webpack.config.react4xp_entriesAndChunks');

const {
    SITE, SRC_R4X, SRC_SITE, SRC_R4X_ENTRIES, R4X_SUB_ENTRIES, BUILD_R4X, RELATIVE_BUILD_R4X, BUILD_ENV, LIBRARY_NAME, EXTERNALS
} = require('./webpack.config.constants');



const DEVMODE = (BUILD_ENV !== 'production');

module.exports = {
    mode: BUILD_ENV,
    
    entry: entriesAndChunks.getEntries(
        BUILD_R4X,
        [
            {
                sourcePath: SRC_R4X_ENTRIES,
                sourceExtensions: ['jsx', 'js', 'es6']
            },
            {
                sourcePath: SRC_SITE,
                sourceExtensions: ['jsx'],
                targetSubDir: SITE                      // <-- Note: this is where top-level react components are included, in the enonic site structure. Only JSX files are included: in order for these to be transpiled here (and thereby become a part of the chunk structure for these static assets) and not by the transpilation of "pure XP" source code files (which should be transpiled separately, outside of the static-asset/chunk structure), take care to separate them! Here, this is done by including only .JSX files here, reserving that extension for toplevel react components, and excluding .JSX files in the babelSite task in build.gradle. Note that if the top-level components import .es6 dependencies, that separation must be done more thoroughly.
            }
        ],
        DEVMODE
    ),

    output: {
        path: BUILD_R4X,                                // <-- Sets the base url for plugins and other target dirs. Note the use of {{assetUrl}} in index.html (or index.ejs).
        filename: "[name].js",                          // <-- Does not hash entry component filenames
        chunkFilename: "[name].[contenthash:9].js",     // <-- Hashes filenames of common-component chunk files
        libraryTarget: 'var',
        library: [LIBRARY_NAME, '[name]'],
    },
    
    resolve: {
        extensions: ['.es6', '.js', '.jsx', '.less']
    },

    devtool: DEVMODE ? 'source-map' : false,

    module: {
        rules: [
            {
                // Babel for building static assets
                test: /\.((jsx?)|(es6))$/,
                exclude: /[\\/]node_modules[\\/]/,
                loader: 'babel-loader',
                query: {
                    compact: !DEVMODE,
                },
            }, {
                test: /\.less$/,
                loaders: ["style-loader", "css-loader", "less-loader"]
            }
        ]
    },

    externals: EXTERNALS,

    optimization: {
        splitChunks: {
            name: false,
            cacheGroups: entriesAndChunks.getCacheGroups(
                SRC_R4X,
                [R4X_SUB_ENTRIES],
                {common: 2},
                DEVMODE
            )
        }
    },

    plugins: [
        new Chunks2json({ outputDir: RELATIVE_BUILD_R4X, filename: 'chunks.json' }),
    ]
};

