const thymeleaf = require('/lib/xp/thymeleaf');

const { PAGE_CONTRIBUTIONS_HTML } = require('/lib/enonic/react4xp/pageContributions');

const view = resolve('main.html');

exports.get = req => {
    const model = {
        PAGE_CONTRIBUTIONS_HTML,
        componentRootUrl: `/_/service/${app.name}/react4xp`
    };

    return {
        body: thymeleaf.render(view, model)
    }
};
