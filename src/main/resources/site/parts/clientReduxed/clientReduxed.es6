const portal = require('/lib/xp/portal');
const React4xp = require('/lib/enonic/react4xp');

// Handle the GET request
exports.get = function(request) {
    const component = portal.getComponent();

    const reduxComponent = new React4xp(component)
        .uniqueId();

    const id = reduxComponent.react4xpId;

    reduxComponent.setProps({
        id,
        greetings: {
            greetingsCount: 1,
            greeteeCount: 1,
            greetee: component.config.greeted
        },
    });

    return {
        body: reduxComponent.renderBody(),
        pageContributions: (request.mode === "edit") ?
            {} :
            reduxComponent.renderClientPageContributions()
    };
};
