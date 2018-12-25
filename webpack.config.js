const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC_RES = path.join(__dirname, 'src/main/resources');

const JSX4XP_SRC = 'jsx4xp';
const JSX4XP_ENTRIES = path.join(JSX4XP_SRC, 'entries');
const JSX4XP_COMMON = path.join(JSX4XP_SRC, 'common');

const SRC_JSX4XP_ENTRIES = path.join(SRC_RES, JSX4XP_ENTRIES);
const SRC_JSX4XP_COMMON = path.join(SRC_RES, JSX4XP_COMMON);
const BUILD_MAIN = path.join(__dirname, 'build/resources/main');



const entries = Object.assign({},
    getEntries(SRC_JSX4XP_ENTRIES, 'jsx', path.join('assets', JSX4XP_SRC) + '/'),
    getEntries(SRC_JSX4XP_ENTRIES, 'js', path.join('assets', JSX4XP_SRC) + '/'),
    getEntries(SRC_JSX4XP_ENTRIES, 'es6', path.join('assets', JSX4XP_SRC) + '/')
);

module.exports = {
    entry: entries,
    output: {
        path: path.join(BUILD_MAIN),
        filename: "[name].[contenthash:9].js"
    },
    resolve: {
        extensions: ['.es6', '.js', '.jsx', '.less']
    },
    module: {
        rules: [{
            test: /\.((jsx?)|(es6))$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.less$/,
            loaders: ["style-loader", "css-loader", "less-loader"]
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            template: path.join(SRC_RES, 'index.ejs'),
            filename: path.join(BUILD_MAIN, 'index.html')
        })
    ],

    optimization: {
        splitChunks: {

            name: false,
            cacheGroups: {
                vendors: {
                    name: path.join('assets', 'vendors'),
                    enforce: true,
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: 2
                },
                common: {
                    name: path.join('assets', JSX4XP_SRC),
                    enforce: true,
                    test: new RegExp(JSX4XP_COMMON),
                    chunks: 'all',
                    priority: 1
                }

            }
        }
    }
};

function getEntries(fullDirPath, extension, entryPrefix) {
    return glob.sync(path.join(fullDirPath, '**.' + extension)).reduce(function(obj, el) {
        obj[entryPrefix + path.parse(el).name] = el;
        return obj
    }, {});
}