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

    constructor() {
        super();
        this.state = { items: [] }
    }

    componentDidMount() {
        // this.setState(this.props.items)
        this.setState({
            items: [
                new Item({
                    name: "Støvler",
                    info: "Fine støvler for turer i all slags vær! (sol?)",
                    image: '/resources/main/app/images/image.jpg'
                }), 
                new Item({
                    name: "T-skjorte",
                    info: "Fantastisk skjorte for alle!",
                    image: '/resources/main/app/images/image.jpg'
                }), 
                new Item({
                    name: "Jeans var. 1",
                    info: "Fantastisk jeans for de som liker å være først ute!",
                    image: '/resources/main/app/images/image.jpg'
                }), 
                new Item({
                    name: "Jeans var. 2",
                    info: "Fantastisk jeans for de som liker å være nummer to!",
                    image: '/resources/main/app/images/image.jpg'
                }), 
            ]
        }); 
    }

    renderItems() {
        return this.state.items.map((item, index) => {
            return <UserItemComponent name={item.name} info={item.info} image={item.image} key={index}></UserItemComponent>
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
    items: PropTypes.instanceOf(Item),
};

UserViewComponent.defaultProps = {
}


function mapStateToProps(state) {
    return {
        items: state.get('app').get('items')
        //data: state.get('example').get('data')
    };
}

function mapDispatchToProps(dispatch) {
    return {
        doSomething: (arg) => { userViewComponentActions.doSomething(dispatch, arg); },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(UserViewComponent)
