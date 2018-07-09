import React from 'react';
import PropTypes from 'prop-types';

// Material UI 
import AppBar from '@material-ui/core/AppBar'; 
import Toolbar from '@material-ui/core/Toolbar';
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton'; 
import Typography from '@material-ui/core/Typography'; 
import MenuIcon from '@material-ui/icons/Menu'; 

// Interfaces 
import Item from '../interfaces/item';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as mainActions from '../actions/mainActions'

class TopBar extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            clicked : null
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <AppBar>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu" onClick={this.props.onToggleMenu}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" >
                            HEIHEI
                        </Typography>
                        <Button color="inherit" href="/react-starter-user">User</Button>
                        <Button color="inherit" href="/react-starter-admin">Admin</Button>
                        <Button color="inherit">Store Demo</Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}



TopBar.propTypes = {
    
};

TopBar.defaultProps = {
    onToggleMenu : PropTypes.func,
    buttons : PropTypes.object // {name : string, action: REDUX-action}
}


function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TopBar)
