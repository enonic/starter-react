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


import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as item from '../actions/itemActions'

class SideBar extends React.PureComponent {

    renderList() {
        return this.props.categories.map((category, index) => {
            return <ListItem onClick={() => { alert("action dispatch: ", category.get('action')) }} key={index}>
                <ListItemIcon>
                    <CategoryIcon />
                </ListItemIcon>
                <ListItemText>{category.get('title')}</ListItemText>
            </ListItem>
        })
    }

    render() {
        return (
            <Drawer anchor="left" open={this.props.open}>
                <IconButton color="inherit" aria-label="Menu" onClick={this.props.onToggleMenu}>
                    <CloseIcon />
                </IconButton>
                <Divider />
                <List>
                    {this.renderList.bind(this)()}                    
                </List>
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
        categories: state.get('app').get('categories')
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
