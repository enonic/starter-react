const path = require('path');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const SRC_MAIN = path.join(__dirname, 'src/main');
const BUILD = path.join(__dirname, 'build/resources/main');

const SITE = 'site';
const R4X_HOME = 'react4xp';
const R4X_SUB_ENTRIES = '_entries';   // Special-case subdirectory under /react4xp/. All files under this will be their own chunk, for dynamic, on-demand asset loading of top-level components, which in turn uses shared components chunked under all other subdirectories. TODO: WHAT ABOUT FILES IN ROOT /R4X/ ?

const SRC_SITE = path.join(SRC_MAIN, "resources", SITE);

const R4X_TARGETSUBDIR = R4X_HOME; 
const R4X_ENTRIES = path.join(R4X_HOME, R4X_SUB_ENTRIES);

const SRC_R4X = path.join(SRC_MAIN, R4X_HOME);
const SRC_R4X_ENTRIES = path.join(SRC_MAIN, R4X_ENTRIES);

const BUILD_R4X = path.join(BUILD, R4X_TARGETSUBDIR);

const MODE = 'development'; /*/'production' //*/

module.exports = {
    mode: 'production',
    
    entry: Object.assign({},
        getEntries(SRC_R4X_ENTRIES, ['jsx', 'js', 'es6'], R4X_TARGETSUBDIR),
        getEntries(SRC_SITE, ['jsx'], path.join(R4X_TARGETSUBDIR, SITE)) // <-- Note: this is where top-level react components are included, in the enonic site structure. Only JSX files are included: in order for these to be transpiled here (and thereby become a part of the chunk structure for these static assets) and not by the transpilation of "pure XP" source code files (which should be transpiled separately, outside of the static-asset/chunk structure), take care to separate them! Here, this is done by including only .JSX files here, reserving that extension for toplevel react components, and excluding .JSX files in the babelSite task in build.gradle. Note that if the top-level components import .es6 dependencies, that separation must be done more thoroughly.
    ),

    output: {
        path: path.join(BUILD),  // <-- Sets the base url for plugins and other target dirs. Note the use of {{assetUrl}} in index.html (or index.ejs).
        filename: "[name].js",
        chunkFilename: "[name].[contenthash:9].js",
        libraryTarget: 'var',
        library: ['React4xp', '[name]'],
    },
    
    resolve: {
        extensions: ['.es6', '.js', '.jsx', '.less']
    },
    module: {
        rules: [
            {
                // Babel for building static assets
                test: /\.((jsx?)|(es6))$/,
                exclude: /[\\/]node_modules[\\/]/,
                loader: 'babel-loader',
                query: {
                    compact: (MODE === 'production'),
                }
            }, {
                test: /\.less$/,
                loaders: ["style-loader", "css-loader", "less-loader"]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            template: path.join(SRC_R4X, 'index.html.ejs'),
            filename: path.join(BUILD_R4X, 'index.html')  // <-- TODO: Must be moved to assets after webpack, and have its urls postprocessed, since the paths inside use both {{assetUrl}} and module.exports.output.path as base url.
        }),

        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            template: path.join(SRC_R4X, 'commonChunks.xml.ejs'),
            filename: path.join(BUILD_R4X, 'commonChunks.xml')  
        }),

        // TODO: Automatically build the content of commonChunks.json.ejs from the getCacheGroups results before running this, in order to automatically add automatically built chunks:
        new HtmlWebpackPlugin({
        // TODO: Automate these:
            inject: false,
            hash: false,
            template: path.join(SRC_R4X, 'commonChunks.json.ejs'),
            filename: path.join(BUILD_R4X, 'commonChunks.json')  
        }),
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
            name: path.join(R4X_HOME, 'vendors'),
            enforce: true,
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 100
        },
    };

    // In order to make all directories below SRC_R4X (except _entries and _common) into a chunk of their own, make an array of names of first-level directories below SRC_R4X:
    const chunkDirs = (glob.sync(path.join(SRC_R4X, '**/')) || [])
        .filter(dirr => !!dirr && dirr.startsWith(SRC_R4X))
        .map(dirr => path.parse(dirr.substring(SRC_R4X.length)))
        .filter(dirr => !!dirr && dirr.dir === "/" && dirr.name !== "" && dirr.name !== R4X_SUB_ENTRIES)
        .map(dirr => dirr.name)

    //console.log("Chunkdirs: " + JSON.stringify(chunkDirs, null, 4));
    chunkDirs.forEach(dirr => {
        chunks[dirr] = {
            name: path.join(R4X_HOME, dirr),
            enforce: true,
            test: new RegExp(path.join(SRC_R4X, dirr)),
            chunks: 'all',
            priority: (priorities || {})[dirr] || 1
        }
    })
    console.log("Bundled chunks (as in, not _entries): " + JSON.stringify(chunks, null, 4));
    return chunks;
}
