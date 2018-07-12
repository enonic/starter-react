import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom'
import { connect } from "react-redux";

// Containers
import UserPage from './containers/userPage';
import AdminPage from './containers/adminPage';
import NotFound from './containers/notFoundPage';
import TopBar from './containers/TopBar'; 
import SideBar from './containers/SideBar'; 
import CartPage from './containers/cartPage'; 

// Redux Actions 
import * as mainActions from "./actions/mainActions";
import * as categoryActions from './actions/categoryActions';

// Interfaces 
import Item from './interfaces/item'; 
import Category from './interfaces/category';
// Material UI 
import { MuiThemeProvider } from "@material-ui/core/styles";
// Stylesheet 
import Theme from "./theme";
import './styles/main.less'
// Sample data 
import SampleData from './sampleData.json'; 


class App extends Component {

    constructor(props) {
        super(props); 
        this.state = {
            menuVisible : false
        }
    }

    // STATE HOLDS TEST ITEMS 
    componentDidMount() {
        SampleData.items.map(item => 
            this.props.createItem(
                new Item({ name: item.name, info: item.info, image: item.image , visible: item.visible, category: item.category, id : item.id })
            )
        );
        SampleData.categories.map(data =>
            this.props.createCategory(
                new Category({title: data.title, filter: data.filter, id: data.id})
            )
        );
    }

    toggleMenu() {
        this.setState({
            menuVisible : !this.state.menuVisible
        }); 
    }
    
    render () {
        
        const url = "/app/com.enonic.starter.react/_/service/com.enonic.starter.react/store";
        fetch(url, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                property1 : ":D", 
                property2 : "^-^"
            })
        }).then(response => {
            var result = response.json(); 
            result.then(data => console.log(data)); 
        }); 

        return (
            <div className="App">
            {/*
                <TopBar onToggleMenu={this.toggleMenu.bind(this)} />
                <SideBar open={this.state.menuVisible} onToggleMenu={this.toggleMenu.bind(this)} />
            */}
                <MuiThemeProvider theme={Theme}>
                    <Route path="/" render={(props) => 
                        <TopBar {...props} onToggleMenu={this.toggleMenu.bind(this)} />}
                    /> 
                    <Route path="/" render={(props) => 
                        <SideBar {...props} open={this.state.menuVisible} onToggleMenu={this.toggleMenu.bind(this)} />}
                    /> 
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
                </MuiThemeProvider>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        items: state.get('app').get('allItems')
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createItem: (arg) => { mainActions.createItem(dispatch, arg) },
        createCategory: (arg) => { categoryActions.createCategory(dispatch, arg) },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(App) 
