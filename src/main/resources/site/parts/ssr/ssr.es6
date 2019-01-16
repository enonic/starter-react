const React = require('/lib/enonic/react4xp/react')();
const ReactDOMServer = require('/lib/enonic/react4xp/reactDOMServer')();

const theComponent = (props) => <h1>Det funka jo</h1>;


exports.get = (req) => {
    log.info("React (" + typeof React + "): " + JSON.stringify(React, null, 2));
    return {
        body: ReactDOMServer.renderToStaticMarkup(<theComponent />)
    };
};
