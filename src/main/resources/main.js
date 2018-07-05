import React from 'react';
import ReactDOM from 'react-dom';

// main app
import App from '../app/App';

const title = React.createElement('h1', {}, 'My First React Code');

ReactDOM.render(<App />, document.getElementById('app'))

exports.get = {
    body: title
}