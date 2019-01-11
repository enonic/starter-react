import React from 'react';
import ReactDOM from 'react-dom';

const Test = (props) => <h1>Dette er en test {props.insertedMessage}</h1>;

// TODO: Make this wrapping generalized, from the lib or from the gradle build, pre-transpiled!
export default (targetId, props) => { ReactDOM.render(
    Test(props)
, document.getElementById(targetId)); }