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




// Interfaces 
import Item from '../interfaces/item';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as item from '../actions/itemActions'

class SideBar extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            listItems : []
        }
    }

    componentDidMount() {
        // fetch list from redux-store? 
        this.setState({
            listItems : [
                {
                    title : "Category 1", 
                    action : "FILTER CATEGORY 1"
                }, 
                {
                    title: "Category 2",
                    action: "FILTER CATEGORY 2"
                }
            ]
        })
    }

    renderList() {
        return this.state.listItems.map((item, index) => {
            return <ListItem onClick={() => { alert("action dispatch: ", item.action) }}>
                <ListItemIcon>
                    <CategoryIcon />
                </ListItemIcon>
                <ListItemText>{item.title}</ListItemText>
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
};

SideBar.defaultProps = {

}


function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
