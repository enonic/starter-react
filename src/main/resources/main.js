var portal = require('/lib/xp/portal');
var router = require('/lib/router')();
var mustache = require('/lib/xp/mustache');


var view = resolve('./index.html');

function handleGet(req) {

    var params = {
        appVersion: app.version,
        assetUrl: portal.assetUrl('bundle.js')
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

