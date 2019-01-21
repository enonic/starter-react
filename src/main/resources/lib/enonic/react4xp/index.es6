const ioLib = require('/lib/xp/io');
const utilLib = require('/lib/enonic/util');
const HTMLinserter = __.newBean('com.enonic.xp.htmlinserter.HtmlInserter');
const SSRreact4xp = __.newBean('com.enonic.xp.react4xp.React4xp');


// TODO: centralize these even more? Along with other strings that must match?
const R4X = 'react4xp';
const LIBRARY_NAME = 'React4xp';

const SERVICES_ROOT = `/_/service/${app.name}/`;
const BASE_PATHS = {
    part: "parts",
    page: "pages",
};


const buildBasicPageContributions = (chunkHashFiles) => {
    const pageContributions = {};

    chunkHashFiles.forEach(chunkFile => {
        const chunks = JSON.parse(
            utilLib.data.forceArray(
                ioLib.readLines(
                    ioLib.getResource(chunkFile).getStream()
                )
            ).join("")).chunks;
        //log.info("chunks: " + JSON.stringify(chunks, null, 2));

        Object.keys(chunks).forEach(section => {
            chunks[section].forEach(chunk => {
                if ((chunk.entry || "").startsWith(R4X + '/')) {
                    chunk.entry = chunk.entry.substring(R4X.length + 1);
                }
                pageContributions[section] = [
                    ...(pageContributions[section] || []),
                    `<script ${chunk.defer ? "defer " : ""}type="text/javascript" src="${SERVICES_ROOT}${R4X}/${chunk.entry}" ></script>`
                ];
            });
        });
    });
    //log.info("\nBuilt basic pageContributions:\n" + JSON.stringify(pageContributions, null, 2) + "\n");
    return pageContributions;
}



// Use the json files built by webpack to fetch the contenthashed filenames for commonChunks.
// Then use those to build a set of basic page contributions common to all components:
const PAGE_CONTRIBUTIONS = buildBasicPageContributions([
    `/${R4X}/chunks.externals.json`,
    `/${R4X}/chunks.core.json`,
    `/${R4X}/chunks.components.json`
]);



const bodyHasContainer = (body, react4xpId) => {
    const react4xpPattern = new RegExp("<[^>]+\\s+id\\s*=\\s*[\"']" + react4xpId + "[\"']", 'i');
    //log.info(JSON.stringify({react4xpId: react4xpId, react4xpPattern}, null, 2));

    return !!body.match(react4xpPattern);
};



const buildContainer = (react4xpId) => `<div id="${react4xpId}"></div>`;


const mergePageContributions = (pageContributions) => (!pageContributions) ?
    {...PAGE_CONTRIBUTIONS} :
    {
        headBegin: [ ...utilLib.data.forceArray(PAGE_CONTRIBUTIONS.headBegin), ...utilLib.data.forceArray(pageContributions.headBegin) ],
        headEnd: [ ...utilLib.data.forceArray(PAGE_CONTRIBUTIONS.headEnd), ...utilLib.data.forceArray(pageContributions.headEnd) ],
        bodyBegin: [ ...utilLib.data.forceArray(PAGE_CONTRIBUTIONS.bodyBegin), ...utilLib.data.forceArray(pageContributions.bodyBegin) ],
        bodyEnd: [ ...utilLib.data.forceArray(PAGE_CONTRIBUTIONS.bodyEnd), ...utilLib.data.forceArray(pageContributions.bodyEnd) ],
    };




const getReact4xpWithParams = (params) => {
    const {jsxPath, component, jsxFileName, props, react4xpId, uniqueId} = params || {};

    if (jsxPath && component) {
        throw Error("Can't render React4xp for client: ambiguent parameters - use jsxPath or component, not both.");
    } else if (!jsxPath && !component) {
        throw Error("Can't render React4xp for client: need jsxPath or component (but not both)");
    }

    const react4xp = new React4xp(component || jsxPath);

    if (props) {
        react4xp.setProps(props);
    }

    if (react4xpId) {
        react4xp.setId(react4xpId);
    }

    if (uniqueId) {
        if (typeof uniqueId === "string") {
            react4xp.setId(uniqueId);
        }
        react4xp.uniqueId();
    }

    if (jsxFileName) {
        react4xp.setJsxFileName(jsxFileName);
    }

    return react4xp;
}


//////////////////////////////////////////////////////////////////////

class React4xp {

    // TODO: FIKS CONSTRUCTOREN HER SÅNN AT DEN TAR IMOT KUN OBLIGATORISKE PARAMETERE - OG DET BARE ER DER DE KAN SETTES.
    // //TELESKOPMETODENE SKAL BARE KUNNE JUSTERE VALGFRIE PARAMETERE, OG DE KAN BARE SETTES SÅNN.

    /** Mandatory constructor initParam, one of two options (overloaded function):
     * @param Component {Object} The portal.getComponent() object of the Enonic XP component (currently page or part
     *     only) that the react component belongs to. XP and react components are found in the same folder (and the component
     *     object is used to extrapolate the resource path - jsxPath).
     *
     * @param JsxPath {String} A full path to a top-level component react component,
     *     relative to the folder where the transpiled (JS) react components are found.
     *
     *     Corresponds to component name, available when client-rendering as a prefixed URL which
     *     returns a JS script that, when run, exposes the component function as React4xp[jsxPath].default to the client.
     *
     *     That component root folder is (currently) build/resources/main/react4xp/ , or in the JAR: react4xp/ .
     *     JsxPath can also be extrapolated from the source (untranspiled JSX) component this way:
     *         - Its path under src/main/react4xp/_components/
     *         - Or under src/main/resources/site (in which case jsxPath will start with "site/").
     *     JsxPath includes the file name without the file extension.
     */
    constructor(initParam) {
        this.props = null
        this.react4xpIdLocked = false;

        if (typeof initParam === "object") {
            if (!initParam || !initParam.descriptor || !initParam.type) {
                throw Error(`Can't initialize Reac4xp component with initParm = ${JSON.stringify(initParam, null, 2)}. Doesn't seem to be a valid XP component object - missing type or descriptor?`);
            }
            this.component = initParam;
            const compName = this.component.descriptor.split(":")[1];
            this.jsxPath = `site/${BASE_PATHS[this.component.type]}/${compName}/${compName}`;
            this.react4xpId = `${BASE_PATHS[component.type]}_${compName}_${component.path}`.replace(/\//g, "_")

        } else if (typeof initParam === "string") {
            this.component = null;
            this.react4xpId = null;
            this.jsxPath = initParam.trim();
            if (this.jsxPath === "") {
                throw Error(`Can't initialize Reac4xp component with initParm = ${JSON.stringify(initParam, null, 2)}. XP component object or jsxPath string only, please.`);
            }

        } else {
            throw Error(`Can't initialize Reac4xp component with initParm = ${JSON.stringify(initParam, null, 2)}. XP component object or jsxPath string only, please.`);
        }
    }



    //---------------------------------------------------------------

    checkIdLock() {
        if (this.react4xpIdLocked) {
            throw Error("This component has already been used to generate a body or pageContributions. Container ID can't be changed now.");
        }
    }

    /** Sets the react4xpId - the HTML ID of the target container this component will be rendered into.
      * Deletes the ID if arguemnt is omitted.
      */
    setId(react4xpId) {
        this.checkIdLock();
        this.react4xpId = react4xpId;
        return this;
    }

    /** Appends a unique target container ID postfix after the currently set reactXpId (if any).
      */
    uniqueId() {
        this.checkIdLock();
        this.react4xpId = (this.react4xpId || "") + "_" + Math.floor(Math.random() * 99999999);
        return this;
    }

    ensureAndLockId() {
        if (!this.react4xpId) {
            this.uniqueId();
        }
        this.react4xpIdLocked = true;
    }



    //---------------------------------------------------------------

    /** When you want to use a JSX component file in the XP component folder, but the JSX file has a different file name
      * than the part, initialize the React4XP with the XP component (extrapolates the path) and then call this method
      * with only the file name (or initialize the component with ).
      */
    setJsxFileName(jsxFileName) {
        if (!this.component) {
            throw Error("This React4xp component has already been initialized with a jsxPath. Use that in the constructor to set a Jsx file name.");
        }

        if ((jsxFileName || "").trim() === "") {
            throw Error(`Empty React4xp jsx component name is not allowed: ${JSON.stringify(jsxFileName, null, 2)}`);
        }

        // Strip away leading './' and trailing file extensions
        if (jsxFileName.startsWith('./')) {
            jsxFileName = jsxFileName.substring(2);
        }
        jsxFileName = (jsxFileName.endsWith('.jsx') || jsxFileName.endsWith('.es6')) ?
            jsxFileName.slice(0, -4) :
            (jsxFileName.endsWith('.js')) ?
                jsxFileName.slice(0, -3) :
                jsxFileName;

        const compName = this.component.descriptor.split(":")[1];
        this.jsxPath = `site/${BASE_PATHS[this.component.type]}/${compName}/${jsxFileName}`;
    }




    //---------------------------------------------------------------

    /** Sets the component's top-level props. Must be a string-serializeable object!
      */
    setProps(props) {
        if (!props || typeof props !== 'object') {
            throw Error("Top-level props must be a string-serializeable object.");
        }
        this.props = props;
        return this;
    }



    //--------------------------------------------------------------- RENDERING METHODS:

    /** Gets/modifies an HTML body with a target container whose ID matches this component's react4xpId.
      * @param body {string} Existing HTML body, for example rendered from thymeleaf.
      *     If it already has a matching-ID target container, body passes through unchanged (use this option and the
      *     setId method to control where in the body the react component should be inserted). If it doesn't have a
      *     matching container, a matching <div> will be inserted at the end of the body, inside the root element. If
      *     body is missing, a pure-target-container body is generated and returned.
      */
    renderClientBody(body) {
        this.ensureAndLockId();

        // If no (or empty) body is supplied: generate a minimal container body with only a target container element.
        if (((body || '') + "").replace(/(^\s+)|(\s+$)/g, "") === "") {
            return buildContainer(this.react4xpId);
        }

        // If there is a body but it's missing a target container element: 
        // Make a container and insert it right before the closing tag.
        if (!bodyHasContainer(body, this.react4xpId)) {
            return HTMLinserter.insertAtEndOfRoot(body, buildContainer(this.react4xpId));
        }

        return body;
    }

    renderClientPageContributions = (pageContributions) => {
        this.ensureAndLockId();

        if (!this.jsxPath) {
            throw Error("Target path for JSX component, jsxPath, has not been set. Add an absolute path or a component in the React4XP constructor or with the setters.");
        }
        if (!this.react4xpId) {
            throw Error("ID for the target container element, react4xpId, has not been set. And there is no component from which to derive it either. Add one of them in the constructor or with one of the setters.");
        }

        const adjustedPgContributions = mergePageContributions(pageContributions);
        adjustedPgContributions.bodyEnd = utilLib.data.forceArray(adjustedPgContributions.bodyEnd);

        // Adds the component.jsx script and a trigger. Assumes that it reads its own required data from the data-react4xp attributes -targetId and -props.
        // If not, the exported default from that script can be reached like this: <script>React4xp['${componentName}'].default</script>
        adjustedPgContributions.bodyEnd.push(`
<script type="text/javascript" src="${SERVICES_ROOT}${R4X}/${this.jsxPath}.js"></script> 
<script defer type="text/javascript" data-react4xp-targetId=${JSON.stringify(this.react4xpId)} ${this.props ? `data-react4xp-props='${JSON.stringify(this.props)}'` : ''}>
    ${LIBRARY_NAME}.Core.render(${LIBRARY_NAME}['${this.jsxPath}'].default);
</script>`);

        return adjustedPgContributions;
    };

    renderToStaticMarkup = (body) => SSRreact4xp.renderToStaticMarkup(this.jsxPath, JSON.stringify(this.props));



    /////////////////////////////////////////////////



    /** All-in-one client-renderer. Returns a body and pageContributions object that can be directly returned from an XP controller.
      * @param params
      */
    static renderClient = (params) => {
        const react4xp = getReact4xpWithParams(params);
        const {body, pageContributions} = params || {};
        return {
            body: react4xp.renderClientBody(body),
            pageContributions: react4xp.renderClientPageContributions(pageContributions)
        }
    };


    /** All-in-one serverside-renderer. Returns a static HTML body string.
     * @param params
     */
    static renderStaticMarkups = (params) => {
        const react4xp = getReact4xpWithParams(params);
        const {body} = params || {};
        return react4xp.renderToStaticMarkup(body)
    };
}

module.exports = React4xp;
