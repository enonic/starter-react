var router = require('/lib/router')();

// Handle all GET requests
exports.get = function (req) {
    return router.dispatch(req);
};

router.get('', function (req) {
    log.info("Nonesuch.");
    var component = req.pathParams.component;
    log.info("rcomponent: " + JSON.stringify(component, null, 2));

    return {body: "Nonesuch"};
});

router.get('/{component}', function (req) {
    log.info("react4xp service!\nreq: " + JSON.stringify(req, null, 2));
    var component = req.pathParams.component;
    log.info("component: " + JSON.stringify(component, null, 2));

    return {body: "Component"};
});
