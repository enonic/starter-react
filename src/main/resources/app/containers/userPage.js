import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as mainActions from '../actions/mainActions' 

// Components 
import UserItemComponent from "../components/userItemComponent"
import UserSearchComponent from "../components/UserSearchComponent"; 

// Stylesheets
import '../styles/userPage.less'

// Interfaces
import Item from '../interfaces/item'; 

// Sample data 
import SampleData from '../sampleData.json'; 

class UserPage extends React.PureComponent { 
  
  // STATE HOLDS TEST ITEMS 
  componentDidMount() {
    SampleData.items.map(item => this.props.createItem(new Item({ name: item.name, info: item.info, image: item.image }))); 
  }

  renderItems() {
    return this.props.items.map((item, index) => {
      return <UserItemComponent
        item={item}
        key={index}
        add={this.props.addItemToCart}
      >
      </UserItemComponent>
    })
  }

  render() {
    return (
      <div className="UserPage">
        <UserSearchComponent />
        {this.renderItems()}
      </div>
    );
  }
}

UserPage.propTypes = {
  items: PropTypes.object
};

UserPage.defaultProps = {
}


function mapStateToProps(state){
	return {
    items: state.get('app').get('allItems')
	};
}

function mapDispatchToProps(dispatch) {
  return {
    createItem: (arg) => { mainActions.createItem(dispatch, arg)}, 
    addItemToCart: (arg) => {mainActions.addItemToCart(dispatch,arg)},
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
