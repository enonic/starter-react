import React from 'react';

import Something from '../common/Something';
import AComponent from '../sharedcomps/AComponent';

export default (props) =>
    <div>
        <h1>App.jsx: Heres some stuff.</h1>
        <AComponent />
        <Something something="SOMETHING ELSE" />
    </div>;
