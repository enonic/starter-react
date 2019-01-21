const portal = require('/lib/xp/portal'); 
const thymeleaf = require('/lib/xp/thymeleaf'); 
const React4xp = require('/lib/enonic/react4xp'); 

// Specify the view file to use
const view = resolve('complex-reactive.html');


// Handle the GET request
exports.get = function(req) {
    //log.info("complex-reactive request: " + JSON.stringify(req, null, 2));

    const component = portal.getComponent();
    
    const model = {};
    let body = thymeleaf.render(view, model);

    const then = new Date().getTime();

    // Just to prove that existing pageContributions aren't overwritten:
    let pageContributions = {
        headEnd: '<script>console.log("headEnd");</script>',
        bodyEnd: '<script>console.log("bodyEnd");</script>',
    };
    
    
    // Construction using the telescope builder pattern, using the "first.jsx" component in the part's (XP component) own path and generating a unique target container ID, also using the component
    const firstReact = new React4xp(component)
        .setJsxFileName("first")
        .uniqueId()
        .setProps({ insertedMessage: "fra \"første props\"!" });


    // Demonstrates targeting an existing target container in the HTML view. Targets the "second.jsx" react component in this (the XP component's own) folder
    const secondReact = new React4xp(component)
        .setProps({ insertedMessage: "fra \"andre props\"!" })
        .setId('existing-react4xp-target')
        .setJsxFileName('second');


    // Demonstrates setting a chosen ID and uniquifying it, but generating the container as it's not found in the HTML
    const thirdReact = new React4xp('app')
        .setId('thirdReact4xp').uniqueId();


    // Builds the body and page contributions by appending them stepwise:
    body = firstReact.renderClientBody(body);
    body = secondReact.renderClientBody(body);
    body = thirdReact.renderClientBody(body);

    pageContributions = firstReact.renderClientPageContributions(pageContributions);
    pageContributions = secondReact.renderClientPageContributions(pageContributions);
    pageContributions = thirdReact.renderClientPageContributions(pageContributions);

    const now = new Date().getTime();
    log.info("Complex-reactive rendered in: " + (now - then) + " ms");

    return { body, pageContributions };
};
