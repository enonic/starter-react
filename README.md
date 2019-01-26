# React project starter for Enonic XP

Easy React in XP! 

This starter abstracts away the complexity needed for React to play nice with Enonic XP. The aim is to give developers a low threshold to get started and React components running, while also exposing some flexible functionality to allow some common use cases.


## Technical overview for changes and advanced use:

Most of the heavy lifting is done at build time, most importantly by [webpack](https://webpack.js.org/). It's automated and currently set up around a particular file and directory structure:   

Webpack detects JSX component entry files under XP's own `src/main/resources/site/` structure, and transpiles them to es5 under `build/resources/main/react4xp` (and `react4xp/` in the deployed JAR). The same transpiled code is run by both the browser (client side rendering) and by nashorn (server side rendering).

Webpack uses [code splitting](https://webpack.js.org/guides/code-splitting/) and layers the transpiled output.  
  - **entries**: minimal JS files that are one top-level React component (or "app") each. These are available to and runnable by the browser and importing other components.  
  - **chunks**: second-level bundles/libraries of shared React (or other) components, importable by the entries.
  - **externals**: third-level and third-party libraries such as React itself, needed both at client and server side. At this level might also be a **vendors** chunk: the leftover, non-externals common deplendencies from node_modules. 
  
This is done for performance by [client-side HTTP caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching): bundling frequently used common dependencies into one, or a few, files that can be loaded client-side ideally just once, and be cached there for fast responsive pages (no need for PWA caching). Everything except the entries get a content-dependent hash added to the file name, so it only changes on actual updates to the dependencies. These hashes are exported by webpack to `chunks.*.json` files, which are used by XP to resolve the dependency file names. There's also a built `entries.json` file, excluding top-level components and ensuring that only dependency files are resolved for hashed names.

### Rendering a JSX component: 
An XP controller (e.g. part or page) can include a react component entry by using the 

blablabla

either by the entry path (see the built `entries.json` file under `build/resources/main/react4xp/`), or let the react4xp XP library (`lib/enonic/react4xp`) extrapolate it from the XP component object, for simplicity. The library does the main work on the backend. The rendered react component can then either be inserted into a container with a particular ID, if an HTML body (e.g. a view) already exists, or it will have a bare-bone view generated for it, and be inserted there.

Client-side rendering: The lib/enonic/react4xp library has some client-oriented rendering methods, in general what they do is to add the necessary URLs for the component entry file and its dependency chunks (which are fetched through the services/react4xp service, in order to control reponse headers and client-side caching) to the pageContributions, and generates/adds a minimal inline script to trigger the component rendering in the browser, by wrapping it in a frontend-rendering script (generally referenced as "core" in the code).

Server-side rendering: similarly, lib/enonic/react4xp has some serverside-oriented rendering methods. These pass the transpiled component to some java code that runs the component in nashorn. The nashorn is pre-polyfilled using some other pre-transpiled code. Also, each specific component is stored in the nashorn engine by name (the name is the component path) on first access, as a function that takes props as argument. This way, the components are slow on the first rendering (around 1 second in the test cases) but much faster on repeated access, even with different props (2 - 30 ms).

Some other java code, HTMLInserter, is responsible for inserting html into other html. This is used for adding a container element to an existing body if it's missing a maching-ID target container, and to insert a rendered component into a target container in a preexisting body.

Errors on serverside running are logged thoroughly for developers, and a minimal error message is returned as HTML for visible output. On errors, that component-function is cleared from the engine's component cache.

Easiest use: let controllers use the general .render method in the react4xp library. It will use the request object to pick the rendering method: server-side for static views in content studio's edit mode, and active client-side rendering for preview and live mode. See the counter part.

Other features:

Detection of JSX source files under the src/main/react4xpfolder, for common components, and component entries that shouldn't belong to a particular XP part/page. This approach is untested and not focused on, but should allow pure-app use, a la the way things are in starter-react right now.
Automatic and developer-controllable chunking of developer-added code under src/main/react4xp: if a JSX file is found under src/main/react4xp/_components or below, it will keep that relative path and be transpiled to an entry component. All other subfolders than _component under src/main/react4xp will be collected to chunks of their own, where the chunk name will be the same as the subfolder.
