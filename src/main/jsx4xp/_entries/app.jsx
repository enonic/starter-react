import React from 'react';
import ReactDOM from 'react-dom';

import AComponent from '../components/AComponent';
import AnotherComponent from '../components/more/AnotherComponent';


const MOUNT_NODE = document.getElementById('mountHere');

ReactDOM.render(
    <AComponent>
        <p>Heres some child stuff.</p>
        <AnotherComponent />
    </AComponent>,
    MOUNT_NODE
);
