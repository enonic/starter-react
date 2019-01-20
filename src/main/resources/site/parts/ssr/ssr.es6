//const React = require('/lib/enonic/react4xp/react')();
//const ReactDOMServer = require('/lib/enonic/react4xp/reactDOMServer')();

//const theComponent = (props) => <h1>Det funka jo</h1>;

const React4xp = require('/lib/enonic/react4xp');

exports.get = (req) => {
    const comp = new React4xp({
        jsxPath: 'site/parts/simple-reactive/simple-reactive',
        react4xpId: 'thirdReact4xp',
        props: {
            insertedMessage: "- easy peasy lemon squeezy!"
        }
    });

    return {
        body: comp.renderToStaticMarkup()
    };
};
