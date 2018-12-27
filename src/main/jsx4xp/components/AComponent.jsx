import React from 'react';

import { Shared } from '../common';

const AComponent = (props) =>
    <div>
        <h1>React stuff is happening.</h1>
        <p>Stuff is reacting.</p>
        {props.children}
    </div> ;

export default AComponent;
