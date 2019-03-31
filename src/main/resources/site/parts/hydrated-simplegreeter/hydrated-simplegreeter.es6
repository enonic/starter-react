const portal = require('/lib/xp/portal');
const React4xp = require('/lib/enonic/react4xp');

// Handle the GET request
exports.get = function(request) {
    const component = portal.getComponent();
    const props = { worldOrSomething: component.config.greeted };

    return React4xp.render(
        request,
        {
            component,
            props,
            jsxPath: "SimpleGreeter",
        },
    );
};
