import React from 'react';
import PropTypes from 'prop-types';

// Material UI 
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";


// Interfaces 
import Item from '../interfaces/item';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as mainActions from '../actions/mainActions'

class SideBar extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    render() {
        return (
            <Drawer anchor="left" open={this.props.open}>
                Categories..
            </Drawer>
        );
    }
}

SideBar.propTypes = {
    sidebarItems: PropTypes.object // {title : string, action : REDUX-action}
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
