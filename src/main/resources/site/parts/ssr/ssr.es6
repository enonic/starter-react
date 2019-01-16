//const React = require('/lib/enonic/react4xp/react')();
//const ReactDOMServer = require('/lib/enonic/react4xp/reactDOMServer')();

//const theComponent = (props) => <h1>Det funka jo</h1>;

const React4xp = require('/lib/enonic/react4xp');

exports.get = (req) => {

    React4xp.testSSR();


    return {
        body: "OK"
    };
};
