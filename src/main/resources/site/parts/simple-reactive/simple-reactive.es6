const portal = require('/lib/xp/portal');
const React4xp = require('/lib/enonic/react4xp'); 

// Handle the GET request
exports.get = function(req) {
    const component = portal.getComponent();
    const then = new Date().getTime();

    const rendered = React4xp.renderClient({ component });

    const now = new Date().getTime();
    log.info("Simple-reactive rendered in: " + (now - then) + " ms");

    return rendered;
};
