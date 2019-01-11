var portal = require('/lib/xp/portal');
var mustache = require('/lib/xp/mustache');

var view = resolve('./index.html');

// Handle all GET requests
exports.get = function (req) {
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
};
