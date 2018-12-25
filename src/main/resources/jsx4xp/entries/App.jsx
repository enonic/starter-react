import React from 'react';
import c from '../common';

const App = (props) =>
    <div>
        <h1> React stuff is happening. </h1>
        <p> Stuff is reacting: { c.shared1() } { c.shared2("SOMETHING") } </p>
        { props.children }
    </div> ;

export default App;
