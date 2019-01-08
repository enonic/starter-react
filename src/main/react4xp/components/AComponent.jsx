import React from 'react';

import Shared from '../common/Shared';

const AComponent = (props) =>
    <div>
        <h1>Acomponent.jsx: React stuff is happening.</h1>
        <p>Acomponent.jsx: Stuff is reacting.</p>
        <Shared></Shared>
        {props.children}
    </div> ;

export default AComponent;
