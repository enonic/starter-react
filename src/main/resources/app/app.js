import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom'
import { connect } from "react-redux";
import * as repoService from './services/repoService';

// Containers
import StorefrontPage from './containers/storefrontPage';
import AdminPage from './containers/adminPage';
import NotFound from './containers/notFoundPage';
import TopBar from './containers/TopBar'; 
import SideBar from './containers/SideBar'; 
import CartPage from './containers/cartPage'; 

// Redux Actions 
import * as mainActions from "./actions/mainActions";
import * as categoryActions from './actions/categoryActions';
import * as imageActions from './actions/imageActions'; 

// Interfaces 
import Item from './interfaces/item'; 
import Category from './interfaces/category';
import Image from "./interfaces/image";
// Material UI 
import { MuiThemeProvider } from "@material-ui/core/styles";
// Stylesheet 
import Theme from "./theme";
import './styles/main.less'
// Fonts
import "typeface-roboto";

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
        repoService.getItems().then(items => {
            if(items.length == 0){
                SampleData.items.map(data => {
                    let item = new Item(data)
                    repoService.addItem(item)
                    this.props.createItem(item)
                });
            } else {
                items.forEach(item =>
                    this.props.createItem(
                        new Item(item)
                    )
                )
            }
        }).then(
            repoService.getCategories().then(categories => {
                if(categories.length == 0){
                    SampleData.categories.map(data => {
                        
                        let category = new Category(data)
                        repoService.addCategory(category)
                        this.props.createCategory(category)
    
                    })
                } else {
                    categories.forEach(category =>{
                        this.props.createCategory(
                            new Category(category)
                        )
                    })
                }
            })
        ).then(() => {
            repoService.getImages().then(images => {
                if(images.length == 0){
                    SampleData.images.map(data => {
                        
                        let image = new Image(data)
                        repoService.addImage(image)
                        this.props.addImage(image)
                    })
                } else {
                    images.forEach(image =>{
                        this.props.addImage(new Image(image))
                    })
                }
            })
        })
    }

    

    toggleMenu() {
        this.setState({
            menuVisible : !this.state.menuVisible
        }); 
    }


    render () {
        return (
            <div className="App">
            {/*
                <TopBar onToggleMenu={this.toggleMenu.bind(this)} />
                <SideBar open={this.state.menuVisible} onToggleMenu={this.toggleMenu.bind(this)} />
            */}
                <MuiThemeProvider theme={Theme}>
                    <Route path="/" 
                        render={(props) =>
                            <TopBar 
                            {...props} 
                            onToggleMenu={this.toggleMenu.bind(this)} 
                            style={{position: 'fixed', top: 0}} 
                        />}                    
                    /> 
                    <Route path="/" render={(props) => 
                        <SideBar {...props} open={this.state.menuVisible} onToggleMenu={this.toggleMenu.bind(this)} />}
                    /> 
                    <Switch className="App-Content">    
                        {/*
                        <Route path={/.+admin/} component={AdminPage} />
                        <Route path={/.+storefront/} component={StorefrontPage} />
                        <Route path={/.+cart/} component={CartPage} />
                        */}
                        <Route path="/app/com.enonic.starter.react/admin" component={AdminPage} />
                        <Route path="/app/com.enonic.starter.react/storefront" component={StorefrontPage} />
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
        addImage: (arg) => { imageActions.addImage(dispatch, arg) },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App) 
