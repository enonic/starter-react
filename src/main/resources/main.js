var portal = require('/lib/xp/portal');
var mustache = require('/lib/xp/mustache');
var repoLib = require('./lib/repo/repo');
var StoreConfig = require('./lib/storeConfig/storeConfig'); 


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


repoLib.initialize(
    StoreConfig.name, 
    StoreConfig.permissions, 
    StoreConfig.user,
    StoreConfig.principal, 
    StoreConfig.path, 
    StoreConfig.branch
); 