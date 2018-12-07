import React from 'react';
import ReactDOM from 'react-dom';

// main app
import App from './App';

const MOUNT_NODE = document.getElementById('app');


ReactDOM.render(
    <App>
        <p>React is indeed stuffing.</p>
    </App>,
    MOUNT_NODE
);
