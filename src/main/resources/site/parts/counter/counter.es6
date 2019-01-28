const portal = require('/lib/xp/portal');
const thymeleaf = require('/lib/xp/thymeleaf');
const React4xp = require('/lib/enonic/react4xp');

const view = resolve("counter.html");

exports.get = (req) => {
    const component = portal.getComponent();

    const model = {
        heading: component.config.heading,
        endquote: component.config.endquote,
    }

    const then = new Date().getTime();

    const rendered = React4xp.render(req,{
        component,
        props: { startCount: parseInt(component.config.countdown) },
        body: thymeleaf.render(view, model),
        id: "the-countdown"
    });

    const now = new Date().getTime();
    log.info("SSR rendered in: " + (now - then) + " ms");

    return rendered;
};
