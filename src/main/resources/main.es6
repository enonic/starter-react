const thymeleaf = require('/lib/xp/thymeleaf');

const { getAllUrls } = require('/lib/enonic/react4xp/dependencies');

const dependencies = getAllUrls('SimpleGreeter');

const view = resolve('main.html');

exports.get = req => {
    const model = {
        dependencies,
        componentRootUrl: `/_/service/${app.name}/react4xp`
    };

    return {
        body: thymeleaf.render(view, model)
    }
};
