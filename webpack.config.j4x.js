const path = require('path');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const SRC_MAIN = path.join(__dirname, 'src/main');
const BUILD = path.join(__dirname, 'build/resources/main');

const ASSETS = 'assets';
const J4X_HOME = 'j4x';
const J4X_SUB_ENTRIES = '_entries';
const J4X_TARGETSUBDIR = path.join(ASSETS, J4X_HOME); 

const J4X_ENTRIES = path.join(J4X_HOME, J4X_SUB_ENTRIES);

const SRC_J4X = path.join(SRC_MAIN, J4X_HOME);
const SRC_J4X_ENTRIES = path.join(SRC_MAIN, J4X_ENTRIES);

const BUILD_ASSETS = path.join(BUILD, ASSETS);
const BUILD_ASSETS_JSX = path.join(BUILD, J4X_TARGETSUBDIR);

console.log(JSON.stringify({
    1: BUILD, 2: BUILD_ASSETS, 4: BUILD_ASSETS_JSX
}, null, 4));

module.exports = {
    mode: 'production',
    
    entry: Object.assign({},
        getEntries(SRC_J4X_ENTRIES, ['jsx', 'js', 'es6'], J4X_TARGETSUBDIR)
    ),

    output: {
        path: path.join(BUILD),  // <-- Sets the base url for plugins and other target dirs. Note the use of {{assetUrl}} in index.html (or index.ejs).
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
            template: path.join(SRC_J4X, 'index.ejs'),
            filename: path.join(BUILD, 'index.html')  // <-- TODO: Must be moved to assets after build, since the paths inside use both {{assetUrl}} and module.exports.output.path as base url.
        }),

        new CleanWebpackPlugin(BUILD_ASSETS_JSX),
    ],

    optimization: {
        splitChunks: {
            name: false,
            cacheGroups: getCacheGroups({common: 2})
        }
    }
};

function getEntries(fullDirPath, extensions, targetPath) {
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

function getCacheGroups(priorities) {
    const chunks = {
        vendors: {
            name: 'assets/vendors',
            enforce: true,
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 100
        },
        /*common: {
            name: J4X_COMMON,
            enforce: true,
            test: new RegExp(SRC_J4X_COMMON),
            chunks: 'all',
            priority: 2
        }*/
    };

    // In order to make all directories below SRC_J4X (except _entries and _common) into a chunk of their own, make an array of names of first-level directories below SRC_J4X:
    const chunkDirs = (glob.sync(path.join(SRC_J4X, '**/')) || [])
        .filter(dirr => !!dirr && dirr.startsWith(SRC_J4X))
        .map(dirr => path.parse(dirr.substring(SRC_J4X.length)))
        .filter(dirr => !!dirr && dirr.dir === "/" && dirr.name !== "" && dirr.name !== J4X_SUB_ENTRIES)
        .map(dirr => dirr.name)
    //console.log("Chunkdirs: " + JSON.stringify(chunkDirs, null, 4));
    chunkDirs.forEach(dirr => {
        chunks[dirr] = {
            name: path.join(ASSETS, J4X_HOME, dirr),
            enforce: true,
            test: new RegExp(path.join(SRC_J4X, dirr)),
            chunks: 'all',
            priority: (priorities || {})[dirr] || 1
        }
    })
    console.log("Bundled chunks (as in, not _entries): " + JSON.stringify(chunks, null, 4));
    return chunks;
}