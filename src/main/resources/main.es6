// XP serves a free-floating (not XP component bound) HTML page with react rendering.

const thymeleaf = require('/lib/xp/thymeleaf');

const { getAllUrls } = require('/lib/enonic/react4xp/dependencies');

const view1 = resolve('main.html');

const view2 = resolve('main2.html');

exports.get = req => {

    const model = {
        dependencies: getAllUrls('SimpleGreeter'),
        componentRootUrl: `/_/service/${app.name}/react4xp`
    };

    return {
        body: thymeleaf.render(view1, model)   // <-- Semi-serverside: client-side rendering, inserting all urls for dependencies and entries with thymeleaf from the model.

        //body: thymeleaf.render(view2, {})       // <-- Pure client-side standalone, completely rendered from HTML that only needs to know the client service url, and uses that to fetch all scripts from services
    }
};
