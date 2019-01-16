import React from 'react';

import Shared from '../common/Shared';

const AComponent = (props) =>
    <div>
        <h2>Acomponent.jsx: React stuff is happening.</h2>
        <p>Stuff is reacting.</p>
        <Shared></Shared>
        {props.children}
    </div> ;

export default AComponent;
