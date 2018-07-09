import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import * as mainActions from '../actions/mainActions' 

class CartPage extends React.PureComponent { 
  
  constructor(props){
    super(props)
  }

  componentDidMount(){
  }

  render() {
    return (
      <div style={styles}>
          Items in cart: 
          {this.props.items.map(item => 
            <CartItemComp 
              item = {item} 
              key = {item.id} 
              remove = {this.props.deleteItem}
            />
          )}
      </div>
      
    );
  }
}

const styles = {
  margin: "20%"
}


CartPage.propTypes = {
  items: PropTypes.object
};

CartPage.defaultProps = {
}


function mapStateToProps(state){
  
	return {
    items: state.get('app').get('allItems')
	};
}

function mapDispatchToProps(dispatch) {
  return {
    deleteItem : (arg) => {mainActions.removeItemFromCart(dispatch,arg)}
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(CartPage)
