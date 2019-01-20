const React4xp = require('/lib/enonic/react4xp');

exports.get = (req) => {
    const then = new Date().getTime();
    const app2 = new React4xp({
        jsxPath: 'level/app2',
        props: {
            insertedMessage: "- easy peasy lemon squeezy!"
        }
    });

    const rendered = app2.renderToStaticMarkup();
    const now = new Date().getTime();

    log.info("Rendered in: " + (now - then) + " ms");

    // TODO: Same as on client-side rendering: the rendered static markup needs to be inserted into the/a body!
    return {
        body: rendered
    };
};
