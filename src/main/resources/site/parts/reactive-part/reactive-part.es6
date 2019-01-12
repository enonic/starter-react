const libs = {
    io: require('/lib/xp/io'),
	portal: require('/lib/xp/portal'), // Import the portal functions
	thymeleaf: require('/lib/xp/thymeleaf'), // Import the Thymeleaf rendering function
    util: require('/lib/enonic/util')
};

// Specify the view file to use
var view = ""; // resolve('reactive-part.html');

const makeFallbackBody = (react4xpId) => `<div id="${react4xpId}"></div>`;

// TODO: centralize this even more?
const R4X = 'react4xp';

const SERVICES_ROOT = `/_/service/${app.name}/`;
const BASE_PATHS = {
    part: "parts/",
    page: "pages/",
};
// Get the corresponding file name 
const getComponentName = (component) => {
    const compName = component.descriptor.split(":")[1];
    return BASE_PATHS[component.type] + compName + "/" + compName;
};

const COMMON_CHUNKS = JSON.parse(
    libs.util.data.forceArray(
        libs.io.readLines(
            libs.io.getResource(`/${R4X}/commonChunks.json`).getStream()
        )
    ).join("")).commonChunks;
log.info("COMMON_CHUNKS: " + JSON.stringify(COMMON_CHUNKS, null, 2));

const PAGE_CONTRIBUTIONS = {};
Object.keys(COMMON_CHUNKS).forEach(section => {
    COMMON_CHUNKS[section].forEach(chunk => {
        if ((chunk.entry || "").startsWith(R4X + '/')) {
            chunk.entry = chunk.entry.substring(R4X.length + 1);
        }
        PAGE_CONTRIBUTIONS[section] = `${(PAGE_CONTRIBUTIONS[section] || '')}<script ${chunk.defer ? "defer " : ""}type="text/javascript" src="${SERVICES_ROOT}${R4X}/${chunk.entry}" ></script>\n`;
    });
});
log.info("PAGE_CONTRIBUTIONS: " + JSON.stringify(PAGE_CONTRIBUTIONS, null, 2));


// Handle the GET request
exports.get = function(req) {
    libs.util.log({request:req}, null, 2); // Source: https://github.com/enonic/lib-util/blob/master/src/main/resources/site/lib/enonic/util/index.js


    // Will be compiled to .js, not .jsx, so resolve that:
    //log.info("\n\nreactComp: " + JSON.stringify(reactComp, null, 2));
    //log.info("view2: " + JSON.stringify(view2, null, 2));

    // Get the content that is using the page
    const content = libs.portal.getContent();
    const component = libs.portal.getComponent();
    const config = component.config;

    //log.info("\n\ncontent: " + JSON.stringify(content, null, 2));
    //log.info("\n\ncomponent: " + JSON.stringify(component, null, 2));

    //var site = libs.portal.getSite();
    //var config = libs.portal.getSiteConfig();

    //log.info(JSON.stringify({site:site}, null, 2));

    let react4xpId = "";

    // Prepare the model that will be passed to the view
    let model = {};

    const props = {
        insertedMessage: "fra controlleren!"
    };

    let componentName = null;

    // ******************************************************************** Lib do this:

    // Uniquely postfix the ID of the react component. 
    // This identifies the target placeholder element as well as inserted props and values.
    react4xpId = ((react4xpId || "") + "").replace(/\s+/g, "");
    if (react4xpId === "") {
        react4xpId = "r4x";
    }
    react4xpId += "_" + Math.floor(Math.random() * 99999999); // TODO: Better make this determined by component path?

    // Insert the target element ID into the model
    model = model || {};
    model.react4xpId = react4xpId;

    // If a view is supplied, render the dynamic HTML with values from the model
    let body = undefined; 
    if (view) {
        body = libs.thymeleaf.render(view, model);
    }

    
    const pageContributions = {...PAGE_CONTRIBUTIONS};
    componentName = R4X + "/site/" + (
        ((componentName || "") + "").trim() || 
        getComponentName(component)
    );

    // Adds tje reactive-part.jsx script, assumes it auto-triggers and reads its own required data from the data-react4xp attributes.
    // If not, the exported default from that script can be reached like this: <script>React4xp['${componentName}'].default</script>
    pageContributions.bodyEnd = `${pageContributions.bodyEnd || ""}<script 
        type="text/javascript"
        data-react4xp-targetId=${JSON.stringify(react4xpId)}
        ${props ? `data-react4xp-props='${JSON.stringify(props)}'` : ''}
        src="${SERVICES_ROOT}${componentName}.js" >\n</script>\n`;
    

    // If the body is empty: Generate fallback body with only a target placeholder element.
    if (((body || '') + "").replace(/(^\s+)|(\s+$)/g, "") === "") {
        body = makeFallbackBody(react4xpId);
        //log.info("Fallback body: " + body);

    // If the body is missing a target placeholder element: Make one and insert it right before the closing tag.
    } else {
        const react4xpPattern = new RegExp("<[^>]+\\s+id\\s*=\\s*[\"']" + react4xpId + "[\"']", 'i');
        log.info(JSON.stringify({react4xpId, react4xpPattern}, null, 2));

        if (!body.match(react4xpPattern)) {
            const elemPatt = /^<\s*(\w+)[\s>]/g;
            const outerElement = elemPatt.exec(body);
            if (!outerElement[1]) {
                throw Error("Huh? Deal with this later: body seems to lack a root element/outer container.");
            }
            const rootElem = outerElement[1];
            const lastTagPattern = new RegExp(rootElem + "(?!.*" + rootElem + ")", "gi");
            const endPos = body.search(lastTagPattern);

            log.info(JSON.stringify({body, endPos}, null, 2));

            body = body.slice(0, endPos) + makeFallbackBody(react4xpId) + body.slice(endPos);
            log.info(JSON.stringify({body}, null, 2));
        }
    }



    // Return the response object
    return { 
        body,
        pageContributions
    }

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
     *              Denne trenger inputs - en "model", eller props?
     *                  react4xpId inni her.
     *                  Lib'et setter det inn, ved å wrappe topp-komponenten: 
     *                      React.render(toppkomponent, document.getElementById(react4xpId))
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
