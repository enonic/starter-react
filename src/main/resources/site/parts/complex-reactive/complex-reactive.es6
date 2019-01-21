const portal = require('/lib/xp/portal'); 
const thymeleaf = require('/lib/xp/thymeleaf'); 
const React4xp = require('/lib/enonic/react4xp'); 

// Specify the view file to use
const view = resolve('complex-reactive.html');

// Get the content that is using the page
//const content = portal.getContent();
//const config = component.config;




// Handle the GET request
exports.get = function(req) {
    log.info("complex-reactive request: " + JSON.stringify(req, null, 2)); 

    const component = portal.getComponent();
    
    const model = {};
    let body = thymeleaf.render(view, model);

    let pageContributions = {
        headEnd: '<script>console.log("headEnd");</script>',
        bodyEnd: '<script>console.log("bodyEnd");</script>',
    };
    
    
    // Demonstrates construction using the telescope builder pattern, using the "first.jsx" component in the part's (XP component) own path and generating a unique target container ID, also using the component
    const firstReact = new React4xp()
        .useXpComponent(component, 'first')
        .uniqueId()
        .setProps({
            insertedMessage: "fra \"første props\"!"
        });
    body = firstReact.renderClientBody(body);
    pageContributions = firstReact.renderClientPageContributions(pageContributions);


    // Demonstrates targeting an existing target container in the HTML view. useXpComponent.skipId is important for that. Targets the "second.jsx" react component in this (the XP component's own) folder
    const props2 = {
        insertedMessage: "fra \"andre props\"!"
    };
    const secondReact = new React4xp({
        props: props2,
        react4xpId: 'existing-react4xp-target'
    }).useXpComponent(component, 'second', true);
    body = secondReact.renderClientBody(body);
    pageContributions = secondReact.renderClientPageContributions(pageContributions);


    // Demonstrates setting a chosen ID without uniquifying it, but generating it as it's not found in the HTML
    const thirdReact = new React4xp({
        jsxPath: 'app',
        react4xpId: 'thirdReact4xp'
    });
    body = thirdReact.renderClientBody(body);
    pageContributions = thirdReact.renderClientPageContributions(pageContributions);

    return { body, pageContributions };


    /**
     * PLAN: 
     * Et lib rendrer body:
     *      Hvis innenfor content studio: Server-side-rendered HTML fra reactkomponenten.
     *      Hvis ikke: HTML å hekte react-entryen på:
     *          -Hvis et view er sendt inn (html-fil), forventes det at det er en XP thymeleaf som inneholder en plassholder-element å hekte react på, 
     *              akkurat denne thymeleaf-ID'en et eller annet sted: <div id="${react4xpId}"></div>.
     *          -Hvis ikke noe view er sendt inn, rendres kun: <div id="${react4xpId}"></div>
     *              
     *          -Hvis react4xpId er tom, genereres en unik id: react4xp_[hash/uid]
     *          -Hvis react4xpId ikke er tom, legges en unik hash/uid etter, som postfix.
     *              NB: Disse må være unike per komponent/path! Så, runtime.
     *          -Denne verdien settes inn i HTML'en enten via thymeleaf eller direkte-rendret.
     * 
     *                        
     * Page contributions:
     *      Hvis ikke innenfor content studio:
     *          <script>-henvisning til transpilert react-komponent entry asset JS fil.
     */
    
};
