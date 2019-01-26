const ioLib = require('/lib/xp/io');
const utilLib = require('/lib/enonic/util');
const HTMLinserter = __.newBean('com.enonic.xp.react4xp.HtmlInserter');
const SSRreact4xp = __.newBean('com.enonic.xp.react4xp.ssr.ServerSideRenderer');



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
    `/${R4X}/chunks.json`
]);



const bodyHasContainer = (body, react4xpId) => {
    const react4xpPattern = new RegExp("<[^>]+\\s+id\\s*=\\s*[\"']" + react4xpId + "[\"']", 'i');
    //log.info(JSON.stringify({react4xpId: react4xpId, react4xpPattern}, null, 2));

    return !!body.match(react4xpPattern);
};



const buildContainer = (react4xpId, content) => `<div id="${react4xpId}">${content || ''}</div>`;


const getUniqueEntries = (arrayOfArrays, controlSet) => {
    const uniqueEntries = [];
    arrayOfArrays.forEach(arr => {
        utilLib.data.forceArray(arr).forEach(item => {
            if (controlSet.indexOf(item) === -1) {
                uniqueEntries.push(item);
                controlSet.push(item);
            }
        })
    });
    return uniqueEntries;
}


/** Merges different pageContributions objects into one. Prevents duplicates: no single pageContribution entry is
  * repeated, this prevents resource-wasting by loading/running the same script twice).
  *
  * @param incomingPgContrib incoming pageContributions (from other components / outside / previous this rendering)
  * @param newPgContrib pageContributions that this specific component will add.
  *
  * Also part of the merge: PAGE_CONTRIBUTIONS, the common standard React4xp page contributions
  */
const mergePageContributions = (incomingPgContrib, newPgContrib) => {
    if (!incomingPgContrib && !newPgContrib) {
        return {...PAGE_CONTRIBUTIONS};
    }
    incomingPgContrib = incomingPgContrib || {};
    newPgContrib = newPgContrib || {};
    const controlSet = [];
    return {
        headBegin: getUniqueEntries([PAGE_CONTRIBUTIONS.headBegin, incomingPgContrib.headBegin, newPgContrib.headBegin], controlSet),
        headEnd: getUniqueEntries([PAGE_CONTRIBUTIONS.headEnd, incomingPgContrib.headEnd, newPgContrib.headEnd], controlSet),
        bodyBegin: getUniqueEntries([PAGE_CONTRIBUTIONS.bodyBegin, incomingPgContrib.bodyBegin, newPgContrib.bodyBegin], controlSet),
        bodyEnd: getUniqueEntries([PAGE_CONTRIBUTIONS.bodyEnd, incomingPgContrib.bodyEnd, newPgContrib.bodyEnd], controlSet)
    };
}


















//////////////////////////////////////////////////////////////////////

class React4xp {

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
            this.react4xpId = `${BASE_PATHS[this.component.type]}_${compName}_${this.component.path}`.replace(/\//g, "_")

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




    /** Optional initializer: returns a React4xp component instance initialized from a single set of parameters instead of
     * the class approach.
     * TODO: Document the params, similar to the class methods.
     */
    static buildFromParams = (params) => {
        const {jsxPath, component, jsxFileName, props, id, uniqueId} = params || {};

        if (jsxPath && component) {
            throw Error("Can't render React4xp for client: ambiguent parameters - use jsxPath or component, not both.");
        } else if (!jsxPath && !component) {
            throw Error("Can't render React4xp for client: need jsxPath or component (but not both)");
        }

        const react4xp = new React4xp(component || jsxPath);

        if (props) {
            react4xp.setProps(props);
        }

        if (id) {
            react4xp.setId(id);
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


    //---------------------------------------------------------------

    checkIdLock() {
        if (this.react4xpIdLocked) {
            throw Error("This component has already been used to generate a body or pageContributions. Container ID can't be changed now.");
        }
    }

    // For now, it seems like a good idea to ensure two things when starting the client side rendering:
    // 1, there is a target ID set.
    // 2, it can't be changed once the rendering has started, i.e. between render body and render pagecontributions
    ensureAndLockId() {
        if (!this.react4xpId) {
            this.uniqueId();
        }
        this.react4xpIdLocked = true;
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
        return this;
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




    /** Generates or modifies existing enonic XP pageContributions. Adds client-side dependency chunks (core React4xp frontend,
      * shared libs and components etc, as well as the entry component scripts.
      * Also returns/adds small scripts that trigger the component scripts. Prevents duplicate references to dependencies.
      *
      * @param pageContributions PageContributions object that the new scripts will be added to. If no input, new ones
      * are instantiated.
      */
    renderClientPageContributions = (pageContributions) => {
        this.ensureAndLockId();

        if (!this.jsxPath) {
            throw Error("Target path for JSX component, jsxPath, has not been set. Add an absolute path or a component in the React4XP constructor or with the setters.");
        }
        if (!this.react4xpId) {
            throw Error("ID for the target container element, react4xpId, has not been set. And there is no component from which to derive it either. Add one of them in the constructor or with one of the setters.");
        }

        return mergePageContributions(pageContributions, {
            bodyEnd: [

                // Browser-runnable script reference for the "naked" react component:
                `<script src="${SERVICES_ROOT}${R4X}/${this.jsxPath}.js"></script>`,

                // That script will expose to the browser an element or function that can be handled by React4Xp.Core.render. Trigger that, along with the target container ID, and props, if any:
                `<script defer>${LIBRARY_NAME}.Core.render(${LIBRARY_NAME}['${this.jsxPath}'].default, ${JSON.stringify(this.react4xpId)} ${this.props ? ', ' + JSON.stringify(this.props) : ''});</script>`
            ]
        });
    };


    /** Generates or modifies an HTML body, with a target container whose ID matches this component's react4xpId.
     * @param body {string} Existing HTML body, for example rendered from thymeleaf.
     *     If it already has a matching-ID target container, body passes through unchanged (use this option and the
     *     setId method to control where in the body the react component should be inserted). If it doesn't have a
     *     matching container, a matching <div> will be inserted at the end of the body, inside the root element. If
     *     body is missing, a pure-target-container body is generated and returned.
     * @param content {string} HTML content that, if included, is inserted into the container with the matching Id.
     */
    renderBody(body, content) {
        this.ensureAndLockId();

        // If no (or empty) body is supplied: generate a minimal container body with only a target container element.
        if (((body || '') + "").replace(/(^\s+)|(\s+$)/g, "") === "") {
            return buildContainer(this.react4xpId, content);
        }

        // If there is a body but it's missing a target container element:
        // Make a container and insert it right before the closing tag.
        if (!bodyHasContainer(body, this.react4xpId)) {
            return HTMLinserter.insertAtEndOfRoot(body, buildContainer(this.react4xpId, content));
        }

        if (content) {
            return HTMLinserter.insertInsideContainer(body, content, this.react4xpId);
        }

        return body;
    }


    renderIntoBody(body) {
        const markup = this.renderToStaticMarkup();
        return this.renderBody(body, markup);
    }


    renderToStaticMarkup = (overrideProps) => {
        return SSRreact4xp.renderToStaticMarkup(this.jsxPath, JSON.stringify(overrideProps || this.props));
    }
















    ///////////////////////////////////////////////// STATIC ALL-IN-ONE RENDERERS

    /** All-in-one client-renderer. Returns a dynamic client-side-running response object that can be directly returned from an XP controller.
      * @param params
      */
    static renderClient = (params) => {
        const react4xp = React4xp.buildFromParams(params);
        const {body, pageContributions} = params || {};
        return {
            body: react4xp.renderBody(body),
            pageContributions: react4xp.renderClientPageContributions(pageContributions)
        }
    };



    /** All-in-one serverside-renderer. Returns a static HTML response object that can be directly returned from an XP controller.
     * @param params
     */
    static renderSSR = (params) => {
        const react4xp = React4xp.buildFromParams(params);
        const {body, pageContributions} = params || {};
        return {
            body: react4xp.renderIntoBody(body),
            pageContributions
        };
    };


    /** All-in-one renderer. Returns a response object that can be directly returned from an XP controller.
      * Renders dynamic/client-side react in XP preview and live mode, and static/server-side in edit mode (XP content studio).
      */
    static render = (request, params) => {
        const react4xp = React4xp.buildFromParams(params);
        const {body, pageContributions} = params || {};
        return (request.mode === "edit") ?
            {
                body: react4xp.renderIntoBody(body),
                pageContributions
            } :
            {
                body: react4xp.renderBody(body),
                pageContributions: react4xp.renderClientPageContributions(pageContributions)
            }
    };
}


module.exports = React4xp;
