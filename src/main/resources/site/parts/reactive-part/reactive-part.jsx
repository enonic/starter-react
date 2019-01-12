import React from 'react';
import ReactDOM from 'react-dom';

const Test = (props) => <h1>Dette er en test {props.insertedMessage}</h1>;

// TODO: make this wrapper into an importable util, or auto-add the wrapping during build? From the lib or from the gradle build, pre-transpiled!
const currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
const targetId = currentScript.getAttribute("data-react4xp-targetId");
const props = JSON.parse(currentScript.getAttribute("data-react4xp-props") || "null") || {};

ReactDOM.render(Test(props), document.getElementById(targetId));
