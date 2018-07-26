import React from 'react';
import PropTypes from 'prop-types';

// Material UI 
import Drawer from "@material-ui/core/Drawer";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close'; 
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CategoryIcon from "@material-ui/icons/Store"; 
// Stylesheets 
import '../styles/sidebar.less'; 


import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import * as mainActions from '../actions/mainActions'

class SideBar extends React.PureComponent {

    categoryOnClick(category){
        this.props.searchCategory(category.filter)
    }

    renderCategories() {
        if(this.props.categories.length <= 0) {
            return "No categories added."; 
        }
        return this.props.categories.map((category, index) => {
            if(category.visible){
                return <Link to="/app/com.enonic.starter.react/storefront" key={index}>
                    <ListItem className="SideBar-ListItem" onClick={() =>  this.categoryOnClick(category)}>
                        <ListItemIcon>
                            <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText>{category.title}</ListItemText>
                    </ListItem>
                </Link>
            }
        })
    }

    renderAdminRoutes(){
        return [ 
            <Link  to={"/app/com.enonic.starter.react/admin"}>
                <ListItem className="SideBar-ListItem" key="items">
                    <ListItemIcon>
                        <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText>Items</ListItemText>
                </ListItem>
            </Link>,

            <Link to="/app/com.enonic.starter.react/admin/categories">
                <ListItem className="SideBar-ListItem" key="categories">
                    <ListItemIcon>
                        <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText>Categories</ListItemText>
                </ListItem>
            </Link>,

            <Link to="/app/com.enonic.starter.react/admin/images">
                <ListItem className="SideBar-ListItem" key="images">
                    <ListItemIcon>
                        <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText>Images</ListItemText>
                </ListItem>
            </Link>

        ]
    }

    renderContent(){
        let path = this.props.location.pathname
        return path.includes("admin") ? this.renderAdminRoutes() : this.renderCategories()
    }

    render() {
        return (
            <Drawer anchor="left" 
                open={this.props.open}
                onClose={this.props.onToggleMenu}
            >
                <div
                    tabIndex={0}
                    role="button"
                    onClick={this.props.onToggleMenu}
                    onKeyDown={this.props.onToggleMenu}
                >
                    <IconButton color="inherit" aria-label="Menu" onClick={this.props.onToggleMenu}>
                        <CloseIcon />
                    </IconButton>
                    <Divider />
                    <List>
                        {this.renderContent.bind(this)()}                    
                    </List>

                </div>
            </Drawer>
        );
    }
}

SideBar.propTypes = {
    onToggleMenu: PropTypes.func,
    categories: PropTypes.object
};

SideBar.defaultProps = {

}


function mapStateToProps(state) {
    return {
        categories: state.get('categories').get('categories'), 
    }
}

function mapDispatchToProps(dispatch) {
    return {
        searchCategory: (arg) => {mainActions.searchCategory(dispatch, arg)}
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
