const portal = require('/lib/xp/portal'); 
const thymeleaf = require('/lib/xp/thymeleaf'); 
const React4xp = require('/lib/enonic/react4xp'); 

// Specify the view file to use
// var view = ""; // resolve('reactive-part.html');

// Get the content that is using the page
//const content = portal.getContent();
//const config = component.config;


// Handle the GET request
exports.get = function(req) {
    log.info("reactive-part request: " + JSON.stringify(req, null, 2)); 

    const component = portal.getComponent();
    
    const props = {
        insertedMessage: "fra controlleren!"
    };

    return React4xp.render({ component, props });



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
