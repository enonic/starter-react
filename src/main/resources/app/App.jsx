import React from 'react';

const App = (props) =>
    <div>
        <h1>React stuff is happening.</h1>
        <p>Stuff is reacting.</p>
        {props.children}
    </div>;


export default App;
