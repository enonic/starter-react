var portal = require('/lib/xp/portal');
var mustache = require('/lib/xp/mustache');
var repoLib = require('./lib/repo/repo');
var repoConfig = require('./lib/config/repoConfig'); 

repoLib.initialize(repoConfig); 

var view = resolve('./index.html');

function handleGet(req) {

    var params = {
        appVersion: app.version,
        assetUrl: portal.assetUrl('')
    };
    
    var body = mustache.render(view, params);

    return {
        contentType: 'text/html',
        headers: {
            'Service-Worker-Allowed': '/'
        },
        body: body
    };
}

exports.get = handleGet;

