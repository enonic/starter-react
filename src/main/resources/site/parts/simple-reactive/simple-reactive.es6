const portal = require('/lib/xp/portal');
const utilLib = require('/lib/enonic/util');
const React4xp = require('/lib/enonic/react4xp'); 

// Handle the GET request
exports.get = function(req) {
    const component = portal.getComponent();
    const then = new Date().getTime();

    const props = {
        insertedMessage: "fra \"den simple kontrolleren\"!"
    };
    const rendered = React4xp.renderClient({ component, props });

    const now = new Date().getTime();
    log.info("Simple-reactive rendered in: " + (now - then) + " ms");

    return rendered;
};
