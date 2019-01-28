import React from 'react';

import Something from '../../common/Something';

const AnotherComponent = (props) =>
    <div>
        <h1>React stuff is happening again!</h1>
        <p>More stuff is reacting:</p>
        <Something something="SOMETHING ELSE" />
        {props.children}
    </div> ;

export default AnotherComponent;
