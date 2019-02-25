// Webpack for transpiling user-added JS, primarily react JSX components: top-level or shared components, component libraries.
// Look mainy for JSX files in:
//
// - src/main/react4xp: Here, each file under /_entries/ will become a separate, top-level component/asset, and
// all other dependencies to those, in all other folders below react4xp, will be bundled into chunks by the name of
// the folder. Third-pardy dependencies in /node_modules/ will be separated out into a vendors bundle, except for externals,
// (based on config in <env.REACT4XP_CONFIG_FILE>, delivered by react-buildconstants and its config/overrides).
//
// All such second-level assets will have content-hashed file names for cache busting, hashes are stored for
// runtime reference in commonChunks.json.
//
// - ...and in the XP structure under src/main/resources/site: Here, JSX files are more tightly bound to their corresponding
// XP component (part, page, etc) but can still use the second-level dependency chunks mentioned above.
const Chunks2json = require('chunks-2-json-webpack-plugin');
const React4xpEntriesAndChunks = require('react4xp-build-entriesandchunks');

module.exports = env => {
    const {
        SRC_R4X, R4X_ENTRY_SUBFOLDER, BUILD_R4X, RELATIVE_BUILD_R4X, BUILD_ENV, LIBRARY_NAME, EXTERNALS, recommended
    } = require(env.REACT4XP_CONFIG_FILE);


    const DEVMODE = (BUILD_ENV !== 'production');

    const entries = React4xpEntriesAndChunks.getEntries(
        recommended.buildEntriesAndChunks.ENTRY_SETS,
        BUILD_R4X,
        DEVMODE
    );
    console.log("\nentries: " + JSON.stringify(entries, null, 2));


    const cacheGroups = React4xpEntriesAndChunks.getCacheGroups(
        SRC_R4X,
        [R4X_ENTRY_SUBFOLDER],
        {sharedComps: 2},
        DEVMODE
    );
    console.log("\ncacheGroups: " + JSON.stringify(cacheGroups, null, 2));


    return {
        mode: BUILD_ENV,

        entry: entries,

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
                cacheGroups
            }
        },

        plugins: [
            new Chunks2json({outputDir: RELATIVE_BUILD_R4X, filename: 'chunks.json'}),
        ]
    };
};
