import React, {Component} from 'react';
import { Route, Switch } from 'react-router'

import HomePage from './containers/homePage';
import NotFound from './containers/notFoundPage';

export default class App extends Component {
    
    render () {
        return (
            <div>
                <Switch>
                    <Route path="/" component={HomePage} />
                    <Route component={NotFound} />
                </Switch>
                
            </div>
        )
    }
}
