const portal = require('/lib/xp/portal');
const React4xp = require('/lib/enonic/react4xp');

// Handle the GET request
exports.get = function(request) {
    const component = portal.getComponent();

    const reduxComponent = new React4xp(component)
        .setJsxFileName('/site/parts/clientReduxed/clientReduxed')
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

    // Server-side rendering with hydration, but with a hydration-free SSR visualization in edit mode. Note the difference from site/parts/clientReduxed/clientReduxed.es6
    return (request.mode === "edit") ?
        {
            body: reduxComponent.renderIntoBody(),
        } :
        {
            body: reduxComponent.renderIntoBody(),
            pageContributions: reduxComponent.renderHydrationPageContributions()
        }
};
