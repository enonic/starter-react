const ioLib = require('/lib/xp/io');
const utilLib = require('/lib/enonic/util');
const htmlInserter = __.newBean('com.enonic.xp.htmlinserter.HtmlInserter');
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
    const pageContributions = {
        // Polyfill commonJS for rendered frontend code?
        /*headEnd: [
            '<script>if (typeof exports === "undefined") { var exports = {}; }</script>'
        ],*/
    };

    chunkHashFiles.forEach(chunkFile => {
        const commonChunks = JSON.parse(
            utilLib.data.forceArray(
                ioLib.readLines(
                    ioLib.getResource(chunkFile).getStream()
                )
            ).join("")).commonChunks;
        //log.info("commonChunks: " + JSON.stringify(commonChunks, null, 2));

        Object.keys(commonChunks).forEach(section => {
            commonChunks[section].forEach(chunk => {
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
    log.info("\nBuilt basic pageContributions:\n" + JSON.stringify(pageContributions, null, 2) + "\n");
    return pageContributions;
}



// Use the json files built by webpack to fetch the contenthashed filenames for commonChunks.
// Then use those to build a set of basic page contributions common to all components:
const PAGE_CONTRIBUTIONS = buildBasicPageContributions([
    `/${R4X}/externals.json`,
    `/${R4X}/core.json`,
    `/${R4X}/commonChunks.json`
]);



const bodyHasContainer = (body, react4xpId) => {
    const react4xpPattern = new RegExp("<[^>]+\\s+id\\s*=\\s*[\"']" + react4xpId + "[\"']", 'i');
    //log.info(JSON.stringify({react4xpId: react4xpId, react4xpPattern}, null, 2));

    return !!body.match(react4xpPattern);
};



const getContainer = (react4xpId) => `<div id="${react4xpId}"></div>`;


const mergePageContributions = (pageContributions) => (!pageContributions) ?
    {...PAGE_CONTRIBUTIONS} :
    {
        headBegin: [ ...utilLib.data.forceArray(PAGE_CONTRIBUTIONS.headBegin), ...utilLib.data.forceArray(pageContributions.headBegin) ],
        headEnd: [ ...utilLib.data.forceArray(PAGE_CONTRIBUTIONS.headEnd), ...utilLib.data.forceArray(pageContributions.headEnd) ],
        bodyBegin: [ ...utilLib.data.forceArray(PAGE_CONTRIBUTIONS.bodyBegin), ...utilLib.data.forceArray(pageContributions.bodyBegin) ],
        bodyEnd: [ ...utilLib.data.forceArray(PAGE_CONTRIBUTIONS.bodyEnd), ...utilLib.data.forceArray(pageContributions.bodyEnd) ],
    };

const removeJsExtensions = (jsxFileName) =>
    (!jsxFileName) ? undefined :
    (jsxFileName.endsWith('.jsx') || jsxFileName.endsWith('.es6')) ? jsxFileName.slice(0, -4) :
    (jsxFileName.endsWith('.js')) ? jsxFileName.slice(0, -3) : jsxFileName;



//////////////////////////////////////////////////////////////////////



class React4xp {
    constructor(params) {
        const {jsxPath, react4xpId, props} = params || {};
        this.react4xpId = react4xpId;
        this.jsxPath = undefined;
        this.props = undefined
        this.setJsxComponentPath(jsxPath) 
        this.setProps(props);
    }



    //---------------------------------------------------------------

    uniqueId() {
        this.react4xpId = (this.react4xpId || "") + "_" + Math.floor(Math.random() * 99999999); // TODO: Better make this determined by component path?";
        return this;
    }

    setReact4xpId(react4xpId) {
        this.react4xpId = react4xpId;
        return this;
    }

    setReact4xpIdPrefix(prefix) {
        this.setReact4xpId(prefix);
        this.uniqueId();
        return this;
    }



    //---------------------------------------------------------------

    setJsxComponentPath(jsxPath) {
        this.jsxPath = removeJsExtensions(jsxPath);
        return this;
    }

    useXpComponent(component, jsxFileName, skipId, uniqueId) {
        //log.info("Use component: " + JSON.stringify(component, null, 2));

        if (jsxFileName) {
            if (jsxFileName.startsWith('./')) {
                jsxFileName = jsxFileName.substring(2);
            }
            jsxFileName = removeJsExtensions(jsxFileName);
        }

        const compName = component.descriptor.split(":")[1];
        this.jsxPath = `site/${BASE_PATHS[component.type]}/${compName}/${jsxFileName || compName}`;

        if (!skipId && !this.react4xpId) {
            const react4xpId = `${BASE_PATHS[component.type]}_${compName}_${component.path}`.replace(/\//g, "_")
            if (uniqueId) {
                this.setReact4xpIdPrefix(react4xpId);
            } else {
                this.setReact4xpId(react4xpId)
            }
        }
        return this;
    }



    //---------------------------------------------------------------

    setProps(props) {
        if (props && typeof props !== 'object') {
            throw Error("Props are optional, but must be an object.");
        }
        this.props = props;
        return this;
    }



    //---------------------------------------------------------------

    getBody(body) {
        if (!this.react4xpId) {
            throw Error("ID for the target container element, react4xpId, has not been set. And there is no component from which to derive it either. Add one of them in the constructor or with one of the setters.");
        }

        // If no (or empty) body is supplied: generate a minimal container body with only a target container element.
        if (((body || '') + "").replace(/(^\s+)|(\s+$)/g, "") === "") {
            return getContainer(this.react4xpId);
        }

        // If there is a body but it's missing a target container element: 
        // Make a container and insert it right before the closing tag.
        if (!bodyHasContainer(body, this.react4xpId)) {
            return htmlInserter.insertAtEndOfRoot(body, getContainer(this.react4xpId));
        }

        return body;
    }

    getPageContributions = (pageContributions) => {       
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
            <script defer
                type="text/javascript"
                data-react4xp-targetId=${JSON.stringify(this.react4xpId)}
                ${this.props ? `data-react4xp-props='${JSON.stringify(this.props)}'` : ''}
                 
            >
                ${LIBRARY_NAME}.Core.render(${LIBRARY_NAME}['${this.jsxPath}'].default);
            </script>`);

        return adjustedPgContributions;
    };





    /////////////////////////////////////////////////

    static render = (params) => {
        const {jsxPath, component, jsxFileName, props, react4xpId, body, pageContributions, uniqueId} = params || {};
        const react4xp = new React4xp({jsxPath, react4xpId, props});

        if (react4xpId) {
            if (uniqueId) {
                react4xp.setReact4xpIdPrefix(react4xpId);
            } else {
                react4xp.setReact4xpId(react4xpId);
            }
        } 

        if (!jsxPath) {
            react4xp.useXpComponent(component, jsxFileName, !!react4xpId, uniqueId);
        }

        return {
            body: react4xp.getBody(body),
            pageContributions: react4xp.getPageContributions(pageContributions)
        }
    }


    static testSSR = () => {
        SSRreact4xp.test();
    }
}

module.exports = React4xp;
