const portal = require('/lib/xp/portal'); 
const thymeleaf = require('/lib/xp/thymeleaf'); 
const React4xp = require('/lib/enonic/react4xp'); 

const htmlInserter = __.newBean('com.enonic.xp.htmlinserter.HtmlInserter');

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
    
    

    const firstReact = new React4xp()
        .useXpComponent(component, 'first')
        .uniqueId()
        .setProps({
            insertedMessage: "fra \"første props\"!"
        });
    body = firstReact.getBody(body);
    pageContributions = firstReact.getPageContributions(pageContributions);

    const props2 = {
        insertedMessage: "fra \"andre props\"!"
    };
    const secondReact = new React4xp({
        props: props2,
        react4xpId: 'secondReact4xp'
    }).useXpComponent(component, 'second', true);
    body = secondReact.getBody(body);
    pageContributions = secondReact.getPageContributions(pageContributions);


    const thirdReact = new React4xp({
        jsxPath: 'app',
        react4xpId: 'thirdReact4xp'
    }).uniqueId();
    body = thirdReact.getBody(body);
    pageContributions = thirdReact.getPageContributions(pageContributions);

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
