var libs = {
	portal: require('/lib/xp/portal'), // Import the portal functions
	thymeleaf: require('/lib/xp/thymeleaf'), // Import the Thymeleaf rendering function
    util: require('/lib/enonic/util')
};

// Specify the view file to use
var view = resolve('reactive-part.html');


// Handle the GET request
exports.get = function(req) {
    libs.util.log({request:req}, null, 2); // Source: https://github.com/enonic/lib-util/blob/master/src/main/resources/site/lib/enonic/util/index.js

    // Get the content that is using the page
    var content = libs.portal.getContent();
    //var site = libs.portal.getSite();
    //var config = libs.portal.getSiteConfig();

    //log.info(JSON.stringify({site:site}, null, 2));

    // Prepare the model that will be passed to the view
    var model = { };

    // Render the dynamic HTML with values from the model
    var body = libs.thymeleaf.render(view, model);

    // Return the response object
    return { body }

    /**
     * PLAN: 
     * Et lib rendrer body:
     *      Hvis innenfor content studio: Server-side-rendered HTML fra reactkomponenten.
     *      Hvis ikke: HTML å hekte react-entryen på:
     *          Hvis et view er sendt inn (html-fil), forventes det at det er en XP thymeleaf som inneholder en plassholder-element å hekte react på, 
     *              akkurat denne thymeleaf-ID'en et eller annet sted: <div id="${jsx4xpId}"></div>.
     *          Hvis ikke noe view er sendt inn, rendres kun: <div id="${jsx4xpId}"></div>
     *              
     *          Hvis jsx4xpId er tom, genereres en unik id: jsx4xp_[hash/uid]
     *          Hvis jsx4xpId ikke er tom, legges en unik hash/uid etter, som postfix.
     *              NB: Disse må være unike per komponent/path! Så, runtime.
     *          Denne verdien settes inn i HTML'en enten via thymeleaf eller direkte-rendret.
     * 
     *                        
     * Page contributions:
     *      Hvis ikke innenfor content studio:
     *          <script>-henvisning til transpilert react-komponent entry asset JS fil.
     *              Denne trenger inputs - en "model", eller props?
     *                  jsx4xpId inni her.
     *                  Lib'et setter det inn, ved å wrappe topp-komponenten: 
     *                      React.render(toppkomponent, document.getElementById(jsx4xpId))
     * 
     *          Og scripthenvisninger til benyttede under-assets/chunks (common, vendors, etc)
     *              
     *          Disse kommer til å ha en hash i navnet
     *                  Hashen eksisterer etter bygging, ikke før, og kan insertes i en .ejs --> .html
     *                      Så, legge en .ejs inn, som bare inneholder det som skal page-contribute's?
     *                      Bygget genererer en .html, som leses og page contributes
     *                          bodyEnd
     *                          Hvis en targetId-verdi er sendt inn i lib'en ved rendring, 
     *                      Serverside caching her!
     *          
     *          Mulig å automatisk få oversikt over chunk-dependencies fra toppkomponenten? 
     *          inntil videre: bare alltid laste alle chunks, siden ideen med hashede chunks er klientsidecaching uansett.
     */
    
};
