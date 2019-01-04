import React from 'react';
import ReactDOM from 'react-dom';

import Something from '../../common/Something';
import AComponent from '../../components/AComponent';

const MOUNT_NODE = document.getElementById('mountHere');

ReactDOM.render(
    <div>
        <p>app2.jsx: Heres some stuff.</p>
        <AComponent />
        <Something something="SOMETHING ELSE" />
    </div>,

    /*<AComponent>
        <p>Heres some child stuff.</p>
        
        
    </AComponent>,*/
    MOUNT_NODE
);
