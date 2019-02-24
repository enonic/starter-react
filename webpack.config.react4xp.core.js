// Webpack for transpiling "frontend core":
// The React4xp (not-third-party) core functionality for running in the client,
// necessary for components to run/render.
//
// Look mainly at src/main/react4xp/_frontendCore_.es6.
//
// The output will be Core.[contentHash].js. Content-hashed file name for cache busting, hash is stored for
// runtime reference in commonChunks.json.


const path = require('path');

const Chunks2json = require('chunks-2-json-webpack-plugin');

module.exports = env => {
    const {
        SRC_R4X, BUILD_R4X, RELATIVE_BUILD_R4X, BUILD_ENV, LIBRARY_NAME, EXTERNALS
    } = require(env.REACT4XP_CONFIG_FILE);

    return {
        mode: BUILD_ENV,

        entry: {
            'Core': path.join(SRC_R4X, '_frontendCore_.es6')
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

        externals: EXTERNALS,

        plugins: [
            new Chunks2json({outputDir: RELATIVE_BUILD_R4X, filename: 'chunks.core.json'}),
        ],

    };
};
