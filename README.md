# React project starter for Enonic XP

## React4xp: easy React in XP! 

This starter abstracts away some complexity and makes React play nice with Enonic XP. The goal is to have a low threshold to get started and React components running, while also exposing some flexible functionality to allow a variety of use cases.

It renders standard JSX files: they have a `.jsx` file extension, and they export as `default` a function with a `props` argument (exporting pure HTML element in JSX works too).

There's Babel support out of the box, for writing everything in glorious ES6.

## How to use

### Example: Hello World

Similar to how things are otherwise handled in Enonic XP, add a JSX react file to the same folder as an XP part or page. File names matter - use the same name as the part or page, and a `.jsx` file extension.

```jsx harmony
// site/parts/example/example.jsx:

import React from 'react';

export default () => <p>Hello world!</p>;
```

Use the `React4xp` library in the part controller, give it the request and the part's component object (needs to be wrapped in a separate object), and return the rendered output directly from the controller:

```jsx harmony
// site/parts/example/example.es6:

const portal = require('/lib/xp/portal');
const React4xp = require('/lib/enonic/react4xp');

exports.get = function(request) {
    const component = portal.getComponent();
    return React4xp.render(request, { component });
};
```

Apart from this you only need the part definition, `site/parts/example/example.xml`. Now add the part to a page in XP content studio, and enjoy as the world is being greeted!

A slightly expanded version of this example is in the source code, at that path. 


### Easy and direct rendering with `React4xp.render` 

`React4xp.render(request, params)` generates an object with `body` and `pageContribution` attributes, ready for being returned as-is from an XP controller. The HTML `body` will contain a target container for the rendered component, inside an HTML body if one was was included in the `params` argument object, or generated if not. 

The `request` argument is used to determine the context of the rendering: 
  - If the rendering happens in the _edit_ mode of XP Content Studio, the react component is rendered server-side as static HTML. In this mode, any pageContributions from the `params` are just passed through unchanged.  
  - If the rendering is in _preview_ or _live_ mode: client-side rendering. The body is ensured to contain a matching-ID target container for rendering in the browser, while the pageContributions get scripts for this rendering - inline and referred by autogenerated URLs.
  
The `params` argument is an object that must include EITHER `component` or  `jsxPath`. All other parameters are optional:
  - `component` (object) XP component object (used to extrapolate a jsxPath - sufficient if JSX entry file is in the same folder and has the same name).
  - `jsxPath` (string) path to react component entry, see available paths in `build/main/resources/react4xp/entries.json` after building. Think of this as the name of the component path.
  - `jsxFileName` (string) For using a JSX entry that's in a XP component folder but with a different file name than the XP component itself. No file extension. Untested: can probably also be used as a relative path to the XP component path?
  - `props` (object) React props to send in to the react component
  - `id` (string) Sets the target container HTML element ID. If this matches an ID in a `body` in params, the react component will be rendered there. If not, a container with this ID will be added. If `id` is missing, the `component` path is used, or a unique ID is generated if there's no component.
  - `uniqueId` (boolean or string) If set, ensures that the ID is unique. If the `id` param is set, a random integer will be postfixed to it. If `uniqueId` is a string, that will be the prefix before the random postfix. If the `id` param is used in addition to a `uniqueId` string, `uniqueId` takes presedence and overrides `id`.
  - `body` (string) Existing HTML body for adding the react component into. For example rendered from thymeleaf. If it already has a matching-ID target container, `body` passes through unchanged in client-side rendering, and has the react component added to the container in server-side rendering. Use this matching-ID option and set the `id` param to control where in the body the react component should be inserted. If there's no matching container, a matching <div> will be inserted at the end of the body, inside the root element of `body`. If `body` is missing, a pure-target-container body is generated and returned.
  - `pageContributions` (object) Pre-existing pageContributions.


## Technical overview and advanced use

### Build

An important part of the the work happens at build time, mainly by [webpack](https://webpack.js.org/). It's automated and currently set up around a particular file and directory structure:   

Webpack detects JSX component entry files (see below) and **transpiles** them to es5 under `build/resources/main/react4xp` (and `react4xp/` in the deployed JAR). The same transpiled code is run by both the browser (client side rendering) or by Nashorn (server side rendering).

Webpack uses [code splitting](https://webpack.js.org/guides/code-splitting/) and layers the transpiled output.  
  - **Entries**: minimal JS files that are one "app" each: a top-level React component. These are what will be fed into the React renderer, available to and runnable by the browser and importing other components. JSX files will be interpreted as React entries if the source files are found under the common XP structire (`src/main/resources/site`) or under a designated directory in React4xp itself (`src/main/react4xp/_components`).
  - **Chunks**: second-level bundles/libraries of shared React (or other) components, importable by the entries. You can force shared code to be bundled into a chunk without changing the webpack.config files: simply put the shared code into `.es6` or `.jsx` files in subdirectories below `src/main/react4xp` and import it from your entries. The build does the rest.
  - **Externals**: third-level and third-party libraries such as React itself, needed both at client and server side. At this level might also be a **vendors** chunk: the leftover, non-externals common deplendencies from `node_modules/`. Use the EXTERNALS object in `webpack.config.constants.json` to separate between externals and vendors chunks.
  
This is done for performance by [client-side HTTP caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching): the chunks/externals/vendors bundle frequently used common dependencies into one, or a few, files that can be loaded client-side ideally just once, and be cached there for fast responsive pages (no need for PWA caching). Everything except the entries get a **content-dependent hash** added to the file name, so it only changes on actual updates to the dependencies. These hashes are exported by webpack to `chunks.*.json` files, which are used by XP to resolve the dependency file names. There's also a built `entries.json` file, which both allows developers to look up available entries, and lets the library exclude the entries from the hashed-name handling.

Because the layers are differently used and have different needs for chunking and hashing strategies, there are 4 webpack steps, each triggered by separate gradle tasks and each with their own `webpack.config.*.js`. In addition to entries, chunks and externals, there's the React4xp frontend-only Core and the backend-only Nashorn polyfills. 
  
### Entries and Core

React component entries can be used by XP by referring to their entry paths (`jsxPath`, unless the XP component is used as a shortcut like in the example). This path is both part of the URL for the component file, and the reference to the component in the client-side script. The global client-side `React4xp` object has some basic `Reac4xp.Core` code that wraps the React renderer, as well as entry path attributes that expose the react components. Reac4xp.Core is built from `src/main/react4xp/clientsideRendering.es6`.

For example, in the hello-world example above, the entry path of `example.jsx` is `"site/parts/example/example"`, so it could also have been rendered with `React4xp.render(request, "site/parts/example/example"):`. Either way, the browser downloads ...`_/service/com.enonic.starter.react/react4xp/site/parts/example/example.js` and calls `React4xp.Core.render` with `React4xp['site/parts/example/example'].default`.       


### The library: `lib/enonic/react4xp/index.es6` 

Used in XP controllers. Relies on webpack having done its job (setting up the entry paths, the hashed chunk names and the correct placement of all the files), and handles the interplay between backend and frontend mainly using the entry paths. In addition to the `.render` method from the hello-world example are some other options:
  - `React4xp.renderSSR(params)`: Same as React4xp.render, but without the `request`, and always renders static server-side markup. No need for a `request` argument. Worth noting: the first server-side rendering in Nashorn is much slower than repeated calls to the same component. The component is cached as a function, so re-calling it even with different props will be much more performant. 
  - `React4xp.renderClient(params)`: Same as React4xp.renderSSR, but always renders active client-side react. Might nota always work so well in XP content studio's edit mode).
  - `React4xp.renderMarkupAndHydrate(params)`: Same as React4xp.renderSSR, but also tries to activate the component (hydrate; populate the previously rendered DOM with active react functionality). As above, your mileage might vary when it comes to how it behaves in XP content studio's edit mode.
  
For more fine-grained control, build a **React4xp instance**. This can be done in two ways:
  - `new React4xp(initParam);`, the basic constructor where `initParam` is either the XP component object, or an entry path string, or
  - `React4xp.buildFromParams(params)`, an all-in-one builder where `params` are the same as for `.renderSSR` and `.renderClient`, except for the `body` and `pageContributions` fields which aren't used here. 
  
This React4xp instance has the following methods:
  - `.setId(id)`: Sets the ID of the target container the component will be rendered into, or deletes it if omitted.
  - `.uniqueId()`: Makes sure the container ID is uinique, using a random postfix.
  - `.setJsxFileName(fileName)`: Adjusts the jsxPath by changing the file name. Useful for different-named jsx files when using the component shortcut.
  - `.setProps(props)`: Sets the component's top-level props.
  - `.renderClientPageContributions(pageContributions)`: Renders only the needed pageContributions for running the component on the client side. Includes dependency chunks, the component script, and the trigger. If a `pageContributions` argument is added, the rendered pageContributions are added to it, removing any duplicate scripts.
  - `.renderBody(body, content)`: Generates an HTML body string (or modifies it, if included as a `body` parameter) with a target container element with the ID of this component - into which the component will be rendered. If the component HTML already has been rendered (e.g. by `.renderToString`), add it as the `content` argument, and it will be inserted into the container.
  - `.renderToString(overrideProps)`: Renders a pure static HTML string of the react component, without a body / other surrounding HTML. If `overrideProps` is added, any props previously added to the instance are ignored.
  - `.renderIntoBody(body)`: Shorthand method, combining `renderToString` and `renderBody` for a full serverside HTML string rendering of the instance. 

The **examples** branch in this repo should have more on how to use this library in controllers.


### The service: `services/react4xp/react4xp.es6`

Used to fetch all transpiled JS files - entries and dependency chunks - by entry path, i.e. the path of the transpiled file below `build/resources/main/react4xp` (or `/react4xp/` in the JAR). Handles headers for efficient clientside HTTP caching, also caches everything to memory on the server for performance. 


### Nashorn server-side rendering

The serverside-oriented rendering methods in the library pass the transpiled component by name (entry path / jsxPath) to some java code that loads and runs the component in Nashorn. The Nashorn engine is pre-polyfilled using some other pre-transpiled code (see `src/main/react4xp/_nashornPolyfills_.es6`). 

Each specific component is stored in the nashorn engine by name on first access, as a function that takes props as argument. This way, the components are slow on the first rendering (around 1 second in the test cases) but much faster on repeated access, even with different props (2 - 30 ms).

Some other java code, HTMLInserter, is responsible for inserting HTML into other HTML. This is used for adding a container element to an existing body if it's missing a maching-ID target container, and to insert a rendered component into a target container in a preexisting body.

Errors on serverside are logged thoroughly for developers, and a minimal error message is returned as HTML for visible frontend output. When errors happen, the component in question is cleared from the engine's component cache.

Nashorn server-side rendering is recommended in the edit mode of XP content studio, to isolate away active scripts (which may interfere with the editing) while still keeping a visual representation of the component. The basic `.render` method selects this automatically.

#### Support, versions and polyfilling

While most react components so far seem to run fine, there may be some cases where the Nashorn engine will complain. If so, adapt your code, or add polyfilling to `src/main/react4xp/_nashornPolyfills_.es6`.

The JS support in Nashorn varies between different JVMs. Enonic XP 6 runs the java 8 JVM, while XP 7 will run java 11, which has better support - including ES6 natively. There may still be uncovered areas and unsupported functions, though.


## Other & misc.:

### Component-less entries

If a JSX file is found under `src/main/react4xp/_components` or below, it will keep that relative path and be transpiled to an entry component. Good for component entries that shouldn't belong to a particular XP part/page. This approach is untested and not focused on, but should allow pure-app use. Files will be transpiled to the `/react4xp/` root folder, and their entry names will be the file path under `_components`, i.e. without "_components" or "site" (or file extension) in the name.

### Controllable chunking

Add other subfolders under `src/main/react4xp/`: All other subfolders than _component under src/main/react4xp will be collected to chunks of their own, where the chunk name will be the same as the subfolder, plus a content hash. This includes both JSX and ES6 source files.

Note that source files that aren't imported by entries will not be transpiled to the build folder. If you add source files right on the `src/main/react4xp/` root folder, they will be bundled into the entry file instead of a chunk - increasing the entry's size!

### Stateful class components

For rendering stateful class components, they must be wrapped during the export:

```jsx harmony
import React from 'react';

class ReduxWorldGreeter expands React.Component {
    constructor(props) {
        this.state = {
            greetee: props || "world",
        }
    }
    
    render() {
        return (<p>Hello {this.state.greetee}!</p>);
    }
}

export default (props) => <ReduxWorldGreeter {...props} />;
```

## More examples

See the examples branches.
