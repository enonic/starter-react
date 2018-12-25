const path = require('path');
const glob = require('glob');

const SRC_RES = path.join(__dirname, 'src/main/resources');
const SRC_JSX4XP = path.join(SRC_RES, 'jsx4xp/entries');
const BUILD_MAIN = path.join(__dirname, 'build/resources/main');



const entries = Object.assign({},
    getEntries(SRC_JSX4XP, 'jsx', 'jsx/'),
    getEntries(SRC_JSX4XP, 'js', 'jsx/'),
    getEntries(SRC_JSX4XP, 'es6', 'jsx/'),
);

module.exports = {
    entry: entries,
    output: {
        path: path.join(BUILD_MAIN, 'assets/'),
        filename: "[name].js"
    },
    resolve: {
        extensions: ['.es6', '.js', '.jsx', '.less']
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.less$/,
            loaders: ["style-loader", "css-loader", "less-loader"]
        }]
    },
};

function getEntries(fullDirPath, extension, entryPrefix) {
    return glob.sync(path.join(fullDirPath, '**.' + extension)).reduce(function(obj, el) {
        obj[entryPrefix + path.parse(el).name] = el;
        return obj
    }, {});
}
