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

const path = require('path');
const glob = require('glob');
const fs = require('fs');

const Chunks2json = require('chunks-2-json-webpack-plugin');

const {
    SITE, SRC_R4X, SRC_SITE, SRC_R4X_ENTRIES, R4X_SUB_ENTRIES, BUILD_R4X, RELATIVE_BUILD_R4X, BUILD_ENV, LIBRARY_NAME, EXTERNALS
} = require('./webpack.config.constants');


// Entries are the non-dependency output files, i.e. react components and other js files that should be directly
// available and runnable to both the browser and the nashorn engine.
// This function builds the entries AND entries.json, which lists the first-level components that shouldn't be counted
// as general dependencies.
const getEntries = () => {
    const entries = Object.assign({},
        getEntriesFromReact4xpSubfolder(SRC_R4X_ENTRIES, ['jsx', 'js', 'es6'], ""),
        getEntriesFromReact4xpSubfolder(SRC_SITE, ['jsx'], SITE)       // <-- Note: this is where top-level react components are included, in the enonic site structure. Only JSX files are included: in order for these to be transpiled here (and thereby become a part of the chunk structure for these static assets) and not by the transpilation of "pure XP" source code files (which should be transpiled separately, outside of the static-asset/chunk structure), take care to separate them! Here, this is done by including only .JSX files here, reserving that extension for toplevel react components, and excluding .JSX files in the babelSite task in build.gradle. Note that if the top-level components import .es6 dependencies, that separation must be done more thoroughly.
    );
    const entryList = Object.keys(entries);
    const entryFile = path.join(BUILD_R4X, 'entries.json');

    // TODO: What about windows slash?
    const slash = "/";
    const dirs = BUILD_R4X.split(slash);
    let accum = "";

    dirs.forEach(dir => {
        accum += dir + slash;
        if (!fs.existsSync(accum)){
            console.log("Create: " + accum);
            fs.mkdirSync(accum);
        }
    });
    fs.writeFileSync(entryFile, JSON.stringify(entryList, null, 2));
    console.log("React4xp entries (aka component names / jsxPath) listed in: " + entryFile);
    return entries;
};


module.exports = {
    mode: BUILD_ENV,
    
    entry: getEntries(),

    output: {
        path: BUILD_R4X,  // <-- Sets the base url for plugins and other target dirs. Note the use of {{assetUrl}} in index.html (or index.ejs).
        filename: "[name].js",
        chunkFilename: "[name].[contenthash:9].js",
        libraryTarget: 'var', // 'var' would easier to use in pure-frontend, accessing exports like: React.[name].function() etc... But 'commonjs' makes chunks easier to use from nashorn.
        library: [LIBRARY_NAME, '[name]'],
    },
    
    resolve: {
        extensions: ['.es6', '.js', '.jsx', '.less']
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
            cacheGroups: getCacheGroups({common: 2})
        }
    },

    plugins: [
        new Chunks2json({ outputDir: RELATIVE_BUILD_R4X, filename: 'chunks.json' }),
    ]
};

// Builds entries from files found under a directory, for selected file extensions, for bein transpiled out to a target path
function getEntriesFromReact4xpSubfolder(fullDirPath, extensions, targetPath) {
    targetPath = (targetPath || "").trim();
    if (targetPath.startsWith("/")) {
        targetPath = targetPath.substring(1);
    }

    const entries = {};
    extensions.forEach(extension => {
        Object.assign(
            entries, 
            glob.sync(path.join(fullDirPath, '**/*.' + extension)).reduce(function(obj, entry) {
                const parsedEl = path.parse(entry);
                if (parsedEl && parsedEl.dir.startsWith(fullDirPath)) {
                    let subdir = parsedEl.dir.substring(fullDirPath.length).replace(/(^\/+)|(\/+$)/g, "");
                    /*if (subdir.length) {
                        subdir += "/";
                    }*/
                    const name = path.join(targetPath, subdir, parsedEl.name);
                    console.log("\t", name);
                    /*console.log("\ttargetPath:", targetPath);
                    console.log("\tsubdir:", subdir);
                    console.log("\tparsedEl.name:", parsedEl.name);*/
                    obj[name] = entry;
                }
                return obj;
            }, {})
        );
    });

    //console.log("entries: " + JSON.stringify(entries, null, 4));
    return entries
}


// Sets up chunking / code splitting: turns subfolders below src/main/react4xp (except _entries)
// into layers of dependency chunks:
// - vendors is third level / third party libs under /node_modules/
// - subfolder names is second level, below the top-level entry components
function getCacheGroups(priorities) {
    const chunks = {
        vendors: {
            name: 'vendors',
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
            name: dirr,
            enforce: true,
            test: new RegExp(path.join(SRC_R4X, dirr)),
            chunks: 'all',
            priority: (priorities || {})[dirr] || 1
        }
    })
    return chunks;
}
