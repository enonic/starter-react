import React from 'react';

import { Shared1 } from '../common';

const AComponent = (props) =>
    <div>
        <h1>React stuff is happening.</h1>
        <p>Stuff is reacting:<Shared1 /></p>
        { props.children }
    </div> ;

export default AComponent;
