import React from 'react';
import {shared1} from '../common';

const App = (props) =>
    <div>
        <h1>React stuff is happening.</h1>
        <p>Stuff is reacting: { shared1() }</p>
        { props.children }
    </div> ;

export default App;
