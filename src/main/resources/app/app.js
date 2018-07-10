import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom'

// Containers
import UserPage from './containers/userPage';
import AdminPage from './containers/adminPage';
import NotFound from './containers/notFoundPage';
import TopBar from './containers/TopBar'; 
import SideBar from './containers/SideBar'; 
import CartPage from './containers/cartPage'; 

// Stylesheet 
import './styles/main.less'


export default class App extends Component {

    constructor(props) {
        super(props); 
        this.state = {
            menuVisible : false
        }
    }

    toggleMenu() {
        this.setState({
            menuVisible : !this.state.menuVisible
        }); 
    }
    
    render () {
        return (
            <div className="App">
                <Switch>    
                    {/*
                    <Route path={/.+admin/} component={AdminPage} />
                    <Route path={/.+user/} component={UserPage} />
                    */}
                    <Route path="/app/com.enonic.starter.react/admin" component={AdminPage} />
                    <Route path="/app/com.enonic.starter.react/user" component={UserPage} />
                    <Route path="/app/com.enonic.starter.react/cart" component={CartPage} />

                    <Route component={NotFound} />
                </Switch>
                <TopBar onToggleMenu={this.toggleMenu.bind(this)}/>
                <SideBar open={this.state.menuVisible} onToggleMenu={this.toggleMenu.bind(this)}/>
            </div>
        )
    }
}
