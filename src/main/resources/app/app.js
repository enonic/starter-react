import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom'

import UserPage from './containers/userPage';
import AdminPage from './containers/adminPage';
import NotFound from './containers/notFoundPage';

// Testing 
import UserViewComponent from './components/UserViewComponent';

export default class App extends Component {
    
    render () {
        return (
            <div>
                <Switch>
                    <Route path="/" component={AdminPage} />
                    <Route path="/user" component={UserPage} />
                    <Route component={NotFound} />
                </Switch>
            </div>
        )
    }
}
