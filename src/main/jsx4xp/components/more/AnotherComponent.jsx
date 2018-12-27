import React from 'react';

import { Shared2 } from '../../common';

const AnotherComponent = (props) =>
    <div>
        <h1>React stuff is happening again!</h1>
        <p>More stuff is reacting:</p>
        <Shared2 something="SOMETHING ELSE" />
        { props.children }
    </div> ;

export default AnotherComponent;
