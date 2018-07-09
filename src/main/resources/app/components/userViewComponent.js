/**
 * Shows an item in the store 
 * The state in this component is for testing only! Redux will be used for storing items 
 */

import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

// Components 
import UserItemComponent from "./UserItemComponent"
import UserSearchComponent from "./UserSearchComponent"; 

// Interfaces 
import Item from '../interfaces/item'; 


// import * as userViewComponentActions from "../actions/userViewComponentActions";

class UserViewComponent extends React.PureComponent {

    renderItems() {
        return this.props.items.map((item, index) => {
            return <UserItemComponent 
                    name={item.name} 
                    info={item.info} 
                    image={item.image} 
                    key={index}
                    >
            </UserItemComponent> 
        })
    }

    render() {
        return (
            <div>
                <UserSearchComponent />
                {this.renderItems()}
            </div>
        );
    }
}

UserViewComponent.propTypes = {
    items: PropTypes.object
};

UserViewComponent.defaultProps = {
}


function mapStateToProps(state) {
    return {
        items: state.get('app').get('allItems')
    };
}

function mapDispatchToProps(dispatch) {
    return {
        doSomething: (arg) => { userViewComponentActions.doSomething(dispatch, arg); },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(UserViewComponent)
