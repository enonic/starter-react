import React from 'react';
import ReactDOM from 'react-dom';

import AComponent from '../components/AComponent';
import AnotherComponent from '../components/more/AnotherComponent';


const MOUNT_NODE = document.getElementById('mountHere');

ReactDOM.render(
    <div>
        <p>Heres some stuff.</p>
        <AComponent />
    </div>,

    /*<AComponent>
        <p>Heres some child stuff.</p>
        
        
    </AComponent>,*/
    MOUNT_NODE
);
