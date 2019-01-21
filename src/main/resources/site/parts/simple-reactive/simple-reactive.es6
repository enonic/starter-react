const portal = require('/lib/xp/portal');
const utilLib = require('/lib/enonic/util');
const React4xp = require('/lib/enonic/react4xp'); 

// Handle the GET request
exports.get = function(req) {
    const component = portal.getComponent();
    
    const props = {
        insertedMessage: "fra \"den simple kontrolleren\"!"
    };

    return React4xp.renderClient({ component, props });
};
