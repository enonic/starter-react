import React from 'react';

import Something from '../../common/Something';
import AComponent from '../../sharedcomps/AComponent';

export default (props) =>
    <div>
        <p>app2.jsx: Heres some stuff.</p>
        <AComponent />
        <Something something="SOMETHING ELSE" />
    </div>;
