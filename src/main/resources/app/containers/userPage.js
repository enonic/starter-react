import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as mainActions from '../actions/mainActions' 

// Components 
import UserItemComponent from "../components/userItemComponent"
import UserSearchComponent from "../components/UserSearchComponent"; 

class UserPage extends React.PureComponent { 
  
  renderItems() {
    return this.props.items.map((item, index) => {
      console.log(item);
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
      <div style={styles}>
        <UserSearchComponent />
        {this.renderItems()}
      </div>
    );
  }
}

const styles = {
  margin: "20%"
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
    addItemToCart: (arg) => {mainActions.addItemToCart(dispatch,arg)},
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
