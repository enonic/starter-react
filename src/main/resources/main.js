var portal = require('/lib/xp/portal');
var mustache = require('/lib/xp/mustache');


var view = resolve('./index.html');


var router = require('/lib/router')();

// Handle all GET requests
exports.get = function (req) {
    return router.dispatch(req);
};

router.get('', function (req) {
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
});

router.get('/react4xp', function (req) {
    return {body: "Error: Missing component path/name."};
});

// This should be a react4xp service, but that doesn't work. Why? This is a start for just a proof of concept though:
router.get('/react4xp/{component}', function (req) {
    log.info("react4xp service!\nreq: " + JSON.stringify(req, null, 2));
    var component = req.pathParams.component;
    log.info("component: " + JSON.stringify(component, null, 2));

    return {body: "Component: " + component};
});
