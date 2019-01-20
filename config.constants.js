const path = require('path');
const fs = require('fs');

const SRC_MAIN = path.join(__dirname, 'src/main');
const BUILD = path.join(__dirname, 'build/resources/main');

const SITE = 'site';
const R4X_SUB_ENTRIES = '_entries';   // Special-case subdirectory under /react4xp/. All files under this will be their own chunk, for dynamic, on-demand asset loading of top-level components, which in turn uses shared components chunked under all other subdirectories. TODO: WHAT ABOUT FILES IN ROOT /R4X/ ?
const R4X_HOME = 'react4xp';

const R4X_TARGETSUBDIR = R4X_HOME;
const SRC_R4X = path.join(SRC_MAIN, R4X_HOME);
const BUILD_R4X = path.join(BUILD, R4X_TARGETSUBDIR);

const SRC_SITE = path.join(SRC_MAIN, "resources", SITE);

const R4X_ENTRIES = path.join(R4X_HOME, R4X_SUB_ENTRIES);
const SRC_R4X_ENTRIES = path.join(SRC_MAIN, R4X_ENTRIES);

const BUILD_ENV = /*'production'; /*/ 'development'; //*/
const LIBRARY_NAME = 'React4xp';

// Shared constants that for different reasons must be available in a mor general format than JS:
const JSON_CONSTANTS = JSON.parse(fs.readFileSync('config.constants.json', 'utf8'));

/*  Common externals from a file, since these values must match everywhere
    and is shared by a gradle step as well as all webpack steps.
    If ever using anything else than output.libraryTarget: 'var' (corresponds to global variable, or "root"),
    use this in the json file instead, etc:

   "react": {
       "root": "React",
       "commonjs2": "react",
       "commonjs": "react",
       "amd": "react"
   },
   "react-dom": {
       "root": "ReactDOM",
       "commonjs2": "react-dom",
       "commonjs": "react-dom",
       "amd": "react-dom"
   }
*/
const EXTERNALS = JSON_CONSTANTS.EXTERNALS;

module.exports = {
    SITE,
    SRC_MAIN, SRC_R4X, SRC_SITE, SRC_R4X_ENTRIES,
    R4X_TARGETSUBDIR, R4X_ENTRIES, R4X_SUB_ENTRIES, R4X_HOME,
    BUILD, BUILD_R4X, BUILD_ENV,
    LIBRARY_NAME,
    EXTERNALS
};
