import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

// Material UI 
import AppBar from '@material-ui/core/AppBar'; 
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
// import Grid from '@material-ui/core/Grid'; 
import IconButton from '@material-ui/core/IconButton'; 
import Typography from '@material-ui/core/Typography'; 
import MenuIcon from '@material-ui/icons/Menu'; 
import StoreIcon from '@material-ui/icons/Store'; 
import CartIcon from "@material-ui/icons/ShoppingCart"; 
// Stylesheets  
import '../styles/topbar.less'; 

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import ToasterComponent from '../components/ToasterComponent';

import * as mainActions from '../actions/mainActions'

class TopBar extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            clicked : null
        }
    }

    renderMenuIcon(){
        if (this.props.location.pathname === "/app/com.enonic.starter.react/user") {
            return <IconButton color="secondary" aria-label="Menu" onClick={this.props.onToggleMenu}>
                <MenuIcon />
            </IconButton>;
        }
        return <IconButton></IconButton>
    }


    render() {
        return (
            <div>
                <AppBar color="primary">
                    <Toolbar>
                        {this.renderMenuIcon()}
                        <Link to="/app/com.enonic.starter.react/user">
                            <IconButton>
                                <StoreIcon />
                            </IconButton>
                        </Link>
                        <Link to="/app/com.enonic.starter.react/cart">
                            <IconButton>
                                <CartIcon />
                            </IconButton>
                        </Link>
                        <Typography 
                            className="TopBar-PageTitle"
                            align="center" 
                            variant="title" 
                            color="textSecondary" >
                            Enonic Webstore
                        </Typography>
                        <Link to="/app/com.enonic.starter.react/admin" className="TopBar-AdminLink">
                            <Typography variant="button">Admin</Typography>
                        </Link>
                    </Toolbar>
                </AppBar>
                <ToasterComponent 
                    visible={this.props.toasterVisible} 
                    message={this.props.toasterMessage}
                />
            </div>
        );
    }
}


TopBar.propTypes = {
    toasterVisible : PropTypes.bool,
    toasterMessage : PropTypes.string

};

TopBar.defaultProps = {
    onToggleMenu : PropTypes.func,
    buttons : PropTypes.object // {name : string, action: REDUX-action}
}


function mapStateToProps(state) {
    let toaster = state.get('toaster')
    return {
        toasterVisible : toaster.get('visible'), 
        toasterMessage : toaster.get('message')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TopBar)
