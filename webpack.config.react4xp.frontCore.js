const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC_MAIN = path.join(__dirname, 'src/main');
const BUILD = path.join(__dirname, 'build/resources/main');

const R4X_HOME = 'react4xp';

const R4X_TARGETSUBDIR = R4X_HOME;

const SRC_R4X = path.join(SRC_MAIN, R4X_HOME);

const BUILD_R4X = path.join(BUILD, R4X_TARGETSUBDIR);

const MODE = 'development'; /*/'production' //*/

module.exports = {
    mode: MODE,
    
    entry: {
        'Core': path.join(SRC_R4X, '_frontendCore_.es6'),
    },

    output: {
        path: BUILD_R4X,  // <-- Sets the base url for plugins and other target dirs. Note the use of {{assetUrl}} in index.html (or index.ejs).
        filename: "[name].[contenthash:9].js",
        libraryTarget: 'var', // 'var' would easier to use in pure-frontend, accessing exports like: React.[name].function() etc... But 'commonjs' makes chunks easier to use from nashorn.
        library: ['React4xp', '[name]'],
    },
    
    resolve: {
        extensions: ['.es6', '.js', '.jsx']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                // Babel for building static assets
                test: /\.((jsx?)|(es6))$/,
                exclude: /[\\/]node_modules[\\/]/,
                loader: 'babel-loader',
                query: {
                    compact: (MODE === 'production'),
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
    ]
};
