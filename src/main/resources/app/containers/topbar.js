import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

// Material UI 
import AppBar from '@material-ui/core/AppBar'; 
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton'; 
import Typography from '@material-ui/core/Typography'; 
import MenuIcon from '@material-ui/icons/Menu'; 
import StoreIcon from '@material-ui/icons/Store'; 
import CartIcon from "@material-ui/icons/ShoppingCart"; 
import Badge from '@material-ui/core/Badge'; 
import Button from '@material-ui/core/Button'; 
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

    onPage = {
        admin: this.props.location.pathname.includes("admin"), 
        storefront : this.props.location.pathname.includes("storefront")
    }

    render() { 
        const path = this.props.location.pathname; 
        let page = (path.includes("store") || path.includes("cart")) ? "store" : "admin"
        return (
            <div>
                <AppBar 
                    className="TopBar"                  
                    color={page === "store" ? 
                        "primary" : 
                        "secondary"}>
                    <Toolbar>
                    <IconButton 
                        className="TopBar-Col"
                        color={page === "store" ? "secondary" : "primary"} 
                        aria-label="Menu" 
                        onClick={this.props.onToggleMenu}>
                        <MenuIcon />
                    </IconButton>
                    {page === "store" 
                        ? <div className="TopBar-Col">
                            <Link to="/app/com.enonic.starter.react/storefront">
                                <IconButton>
                                    <StoreIcon />
                                </IconButton>
                            </Link>
                            <Link to="/app/com.enonic.starter.react/cart">
                                <IconButton>
                                    <Badge badgeContent={this.props.cartItems.size} color="secondary">
                                        <CartIcon />
                                    </Badge>
                                </IconButton>
                            </Link>
                        </div> : 
                        <div className="TopBar-Col"></div>}
                        <Link className="TopBar-Col" to="/app/com.enonic.starter.react/storefront">
                            <Button>
                                <Typography
                                    className="TopBar-PageTitle"
                                    align="center"
                                    variant="title"
                                    color="textSecondary" >
                                    {page === "admin" ? "Back to store" : "Enonic Webstore"}
                            </Typography>
                            </Button>
                        </Link>
                        {page !== "admin" ? 
                            <Link className="TopBar-Col" to="/app/com.enonic.starter.react/admin" className="TopBar-AdminLink">
                                <Typography variant="button">Admin</Typography>
                            </Link> : 
                            <div className="TopBar-Col"></div> }
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
    let toaster = state.get('toaster'); 
    let cartItems = state.get('app').get('cartItems');
    return {
        toasterVisible : toaster.get('visible'), 
        toasterMessage : toaster.get('message'), 
        cartItems: cartItems, 
    }
}

function mapDispatchToProps(dispatch) {
    return {
        
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TopBar)
