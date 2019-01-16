const path = require('path');
const NODE_MODULES = path.join(__dirname, 'node_modules');
const BUILD = path.join(__dirname, 'build', 'resources', 'main', 'lib', 'enonic', 'react4xp');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
    mode: 'development',
    
    entry: {
        'react': path.join(NODE_MODULES, 'react', 'index.js'),
        'reactDOMServer': path.join(NODE_MODULES, 'react-dom', 'server.js')
    },

    output: {
        path: BUILD,  // <-- Sets the base url for plugins and other target dirs. Note the use of {{assetUrl}} in index.html (or index.ejs).
        filename: "[name].js",
        libraryTarget: 'var',
        library: ['[name]']
    },
    
    resolve: {
        extensions: ['.es6', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                // Babel for building static assets
                test: /\.((jsx?)|(es6))$/,
                exclude: /[\\/]node_modules[\\/]/,
                loader: 'babel-loader',
                query: {
                    compact: false
                }
            }
        ]
    },

    /*plugins: [
        new CleanWebpackPlugin(BUILD),
    ]//*/
};
