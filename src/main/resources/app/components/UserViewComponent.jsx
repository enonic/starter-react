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


// import * as itemViewActions from "../actions/itemViewActions";

class ItemView extends React.PureComponent {

    constructor() {
        super();
        this.state = { items: [] }
    }

    componentDidMount() {
        this.setState({
            items: [
                {
                    name: "Støvler",
                    info: "Fine støvler for turer i all slags vær! (sol?)",
                    image: './../../assets/images/image.jpg'
                },
                {
                    name: "T-skjorte",
                    info: "Fantastisk skjorte for alle!)",
                    image: "images/tskjorte.png"
                },
                {
                    name: "Jeans var. 1",
                    info: "Fantastisk jeans for de som liker å være først ute!",
                    image: "images/jeans1.png"
                },
                {
                    name: "Jeans var. 2",
                    info: "Fantastisk jeans for de som liker å være nummer to!",
                    image: "images/jeans2.png"
                }
            ]
        })
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

ItemView.propTypes = {
    items : PropTypes.shape({
        name : PropTypes.string.isRequired, 
        info : PropTypes.string, 
        image : PropTypes.string
    })
};

ItemView.defaultProps = {
}


function mapStateToProps(state) {
    return {
        data: state.get('example').get('data')
    };
}

function mapDispatchToProps(dispatch) {
    return {
        doSomething: (arg) => { itemViewActions.doSomething(dispatch, arg) },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ItemView)
