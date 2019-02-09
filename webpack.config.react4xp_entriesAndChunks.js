// Builds entry and chunk maps from src file structure, that webpack.config.react4xp uses to transpile the react4js component files

const path = require('path');
const glob = require('glob');

const SLASH = (process.platform === "win32") ? "\\" : "/";

// Builds component entries from files found under a directory, for selected file extensions, for being transpiled out to a target path
function buildEntriesToReact4xpSubfolder(params, verbose) {
    if (verbose) {
        console.log("buildEntriesToReact4xpSubfolder: " + JSON.stringify(params, null, 2));
    }

    const sourcePath = params.sourcePath;
    const extensions = params.sourceExtensions;
    let targetPath = (params.targetSubDir || "").trim();
    if (targetPath.startsWith("/")) {
        targetPath = targetPath.substring(1);
    }

    // Builds and returns an object [entries]
    // where values are found files under directory [sourcePath] with any one of the fileExtensions in [extensions],
    // and the values are the corresponding filenames (full path under react4xp subfolder)
    // - which also is the access path (jsxPath) of each component in react4xp.
    return extensions.reduce(
        (accumulator, extension) => Object.assign(
            accumulator,
            glob.sync(path.join(sourcePath, '**/*.' + extension)).reduce(
                (obj, entry) => {
                    const parsedEl = path.parse(entry);
                    if (parsedEl && parsedEl.dir.startsWith(sourcePath)) {
                        let subdir = parsedEl.dir.substring(sourcePath.length).replace(/(^\/+)|(\/+$)/g, "");
                        const name = path.join(targetPath, subdir, parsedEl.name);

                        if (verbose) {
                            console.log("\tEntry: ", name, "->", entry);
                        }

                        obj[name] = entry;
                    }
                    return obj;
                }, {})
        ), {});
}


// Entries are the non-dependency output files, i.e. react components and other js files that should be directly
// available and runnable to both the browser and the nashorn engine.
// This function builds the entries AND entries.json, which lists the first-level components that shouldn't be counted
// as general dependencies.
exports.getEntries = (outputPath, entrySets, verbose) => {
    const entries = (entrySets || []).reduce(
        (accumulator, entrySet) => Object.assign(accumulator, buildEntriesToReact4xpSubfolder(entrySet, verbose)),
        {}
    );

    const fs = require('fs');

    const entryList = Object.keys(entries);
    const entryFile = path.join(outputPath, 'entries.json');

    const dirs = outputPath.split(SLASH);
    let accum = "";
    dirs.forEach(dir => {
        accum += dir + SLASH;
        if (!fs.existsSync(accum)){
            if (verbose) {
                console.log("\tCreate: " + accum);
            }
            fs.mkdirSync(accum);
        }
    });
    fs.writeFileSync(entryFile, JSON.stringify(entryList, null, 2));

    if (verbose) {
        console.log("\tReact4xp entries (aka component names / jsxPath) listed in: " + entryFile);
    }

    return entries;
};




// Sets up chunking / code splitting: turns subfolders below src/main/react4xp (except _entries)
// into layers of dependency chunks:
// - vendors is third level / third party libs under /node_modules/
// - subfolder names is second level, below the top-level entry components
// TODO: It would be nice to be able to generate a map of each component's specific chunk dependencies so not all chunks would always need to be loaded!
exports.getCacheGroups = (sourcePath, subfoldersToIgnore, priorities, verbose) => {
    const chunks = {
        vendors: {
            name: 'vendors',
            enforce: true,
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 100
        },
    };

    // In order to make all directories below sourcePath (except _entries and _common) into a chunk of their own, make an array of names of first-level directories below sourcePath:
    const chunkDirs = (glob.sync(path.join(sourcePath, '**/')) || [])
        .filter(dirr => !!dirr && dirr.startsWith(sourcePath))
        .map(dirr => path.parse(dirr.substring(sourcePath.length)))
        .filter(dirr =>
            !!dirr && dirr.dir === "/" &&
            dirr.name !== "" &&
            (subfoldersToIgnore || []).indexOf(dirr.name) === -1
        )
        .map(dirr => dirr.name);

    chunkDirs.forEach(dirr => {
        chunks[dirr] = {
            name: dirr,
            enforce: true,
            test: new RegExp(path.join(sourcePath, dirr)),
            chunks: 'all',
            priority: (priorities || {})[dirr] || 1
        }
    });

    if (verbose) {
        console.log("Chunks: " + JSON.stringify(chunks, null, 2));
    }

    return chunks;
};

exports.getChunksPlugin = (outputDir) => {
    const Chunks2json = require('chunks-2-json-webpack-plugin');
    return new Chunks2json({ outputDir, filename: 'chunks.json' });
};
