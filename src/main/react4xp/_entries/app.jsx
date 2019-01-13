import React from 'react';
import ReactDOM from 'react-dom';

import React4xp from '..';
import Something from '../common/Something';
import AComponent from '../components/AComponent';

React4xp.render(
    <div>
        <p>app.jsx: Heres some stuff.</p>
        <AComponent />
        <Something something="SOMETHING ELSE" />
    </div>
);
