const path = require('path');

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

const BUILD_ENV = 'development'; /*/'production' //*/
const LIBRARY_NAME = 'React4xp';

module.exports = {
    SITE,
    SRC_MAIN, SRC_R4X, SRC_SITE, SRC_R4X_ENTRIES,
    R4X_TARGETSUBDIR, R4X_ENTRIES, R4X_SUB_ENTRIES, R4X_HOME,
    BUILD, BUILD_R4X,
    BUILD_ENV, LIBRARY_NAME
};
