import React from 'react';
import {shared2} from '../common';

const App = (props) =>
    <div>
        <h1>React stuff is happening again!</h1>
        <p>More stuff is reacting: { shared2("SOMETHING ELSE") } </p>
        { props.children }
    </div> ;

export default App;
