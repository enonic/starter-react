import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom'

import HomePage from './containers/homePage';
import NotFound from './containers/notFoundPage';

// Testing Material UI 
import ItemView from './components/ItemView';

export default class App extends Component {
    
    render () {
        return (
            <div>
                <Switch>
                    <Route path="/" component={HomePage} />
                    <Route component={NotFound} />
                </Switch>
                <ItemView/>
            </div>
        )
    }
}
