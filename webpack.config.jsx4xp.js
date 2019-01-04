const path = require('path');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

const SRC_MAIN = path.join(__dirname, 'src/main');

const HOME = 'jsx4xp';
const SUB_ENTRIES = '_entries';
const SUB_COMMON = 'common';
const ENTRIES = path.join(HOME, SUB_ENTRIES);
const COMMON = path.join(HOME, SUB_COMMON);

const SRC_JSX4XP = path.join(SRC_MAIN, HOME);
const SRC_ENTRIES = path.join(SRC_MAIN, ENTRIES);
const SRC_COMMON = path.join(SRC_MAIN, COMMON);

const BUILD_ASSETS = path.join(__dirname, 'build/resources/main/assets');
const BUILD_ASSETS_TARGETSUBDIR = HOME;


module.exports = {
    mode: 'production',
    
    entry: getEntries(SRC_ENTRIES, ['jsx', 'js', 'es6'], BUILD_ASSETS_TARGETSUBDIR),

    output: {
        path: path.join(BUILD_ASSETS),  // <-- Must be built to assets, since the use of {{assetUrl}} in index.html (or index.ejs) relates to that as base url
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
            template: path.join(SRC_JSX4XP, 'index.ejs'),
            filename: path.join(BUILD_ASSETS, 'index.html')  // <-- Must be built to assets, since the paths inside use both {{assetUrl}} and module.exports.output.path as base url. If needed somewhere else, move it after this build step.
        }),
        new CleanWebpackPlugin(path.join(BUILD_ASSETS, BUILD_ASSETS_TARGETSUBDIR))
    ],

    optimization: {
        splitChunks: {
            name: false,
            cacheGroups: getCacheGroups()
        }
    }
};

function getEntries(fullDirPath, extensions, targetPath, entryPrefix) {
    const entries = {};
    targetPath += "/";
    extensions.forEach(extension => {
        Object.assign(
            entries, 
            glob.sync(path.join(fullDirPath, '**/*.' + extension)).reduce(function(obj, el) {
                const parsedEl = path.parse(el);
                if (parsedEl && parsedEl.dir.startsWith(fullDirPath)) {
                    let subdir = parsedEl.dir.substring(fullDirPath.length).replace(/(^\/+)|(\/+$)/g, "");
                    if (subdir.length) {
                        subdir += "/";
                    }
                    obj[targetPath + subdir +  parsedEl.name] = el;
                }
                return obj;
            }, {})
        );
    });

    //console.log("entries: " + JSON.stringify(entries, null, 4));
    return entries
}

function getCacheGroups() {
    const chunks = {
        vendors: {
            name: 'vendors',
            enforce: true,
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 3
        },
        common: {
            name: COMMON,
            enforce: true,
            test: new RegExp(SRC_COMMON),
            chunks: 'all',
            priority: 2
        }
    };

    // Makes array of names of first-level directories below SRC_JSX4XP, other than _entries and _common:
    const chunkDirs = (glob.sync(path.join(SRC_JSX4XP, '**/')) || [])
        .filter(dirr => !!dirr && dirr.startsWith(SRC_JSX4XP))
        .map(dirr => path.parse(dirr.substring(SRC_JSX4XP.length)))
        .filter(dirr => !!dirr && dirr.dir === "/" && dirr.name !== "" && dirr.name !== SUB_ENTRIES && dirr.name !== SUB_COMMON)
        .map(dirr => dirr.name)

    chunkDirs.forEach(dirr => {
        chunks[dirr] = {
            name: path.join(HOME, dirr),
            enforce: true,
            test: new RegExp(path.join(SRC_JSX4XP, dirr)),
            chunks: 'all',
            priority: 1
        }
    })

    console.log("Bundled (non-_entries) chunks: " + JSON.stringify(chunks, null, 4));

    return chunks;
}