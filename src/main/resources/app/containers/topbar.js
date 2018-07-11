import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

// Material UI 
import AppBar from '@material-ui/core/AppBar'; 
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'; 
import Typography from '@material-ui/core/Typography'; 
import MenuIcon from '@material-ui/icons/Menu'; 

// Interfaces 
import Item from '../interfaces/item';

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

    render() {
        return (
            <div>
                <AppBar>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu" onClick={this.props.onToggleMenu}>
                            {this.props.location.pathname === "/app/com.enonic.starter.react/user" ? 
                                <MenuIcon/> : null}
                        </IconButton>
                        <Typography variant="title" color="inherit" >
                            Enonic Webstore
                        </Typography>
                        <Link to="/app/com.enonic.starter.react/user">
                            <Button color="inherit">User</Button>                        
                        </Link>
                        <Link to="/app/com.enonic.starter.react/admin">
                            <Button color="inherit">Admin</Button>                        
                        </Link>
                        <Link to="/app/com.enonic.starter.react/cart">
                            <Button color="inherit">Cart</Button>
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
