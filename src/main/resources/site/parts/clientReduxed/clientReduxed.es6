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

    // Pure client-side rendering, but with a hydration-free SSR visualization in edit mode. Note the difference from site/parts/hydrateReduxed/hydrateReduxed.es6
    return (request.mode === "edit") ?
        {
            body: reduxComponent.renderIntoBody(),
        } :
        {
            body: reduxComponent.renderBody(),
            pageContributions: reduxComponent.renderClientPageContributions()
        }
};
