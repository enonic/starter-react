import React from 'react';
import PropTypes from 'prop-types';

import CartItemComp from '../components/cartItemComponent';
import CheckoutComponent from '../components/checkoutComponent';

import { connect } from 'react-redux';

import * as mainActions from '../actions/mainActions' 

class CartPage extends React.PureComponent { 
  
  constructor(props){
    super(props)
    this.state = {
      checkout : false
    }
  }

  componentDidMount(){
  }

  renderCheckout(){
    if(this.state.checkout){
      return <CheckoutComponent
        checkout={this.props.checkout}
        checkoutClick={this.buyClick.bind(this)}
      />
    }
    return null
  }

  checkoutClick(){
    this.setState('checkout', this.state.checkout ? false : true)
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
          <button onClick={this.checkoutClick.bind(this)}>Checkout</button>
          {renderCheckout}
      </div>
      
    );
  }
}

const styles = {
  margin: "30%"
}


CartPage.propTypes = {
  items: PropTypes.object
};

CartPage.defaultProps = {
}


function mapStateToProps(state){
  
	return {
    items: state.get('app').get('cartItems')
	};
}

function mapDispatchToProps(dispatch) {
  return {
    deleteItem : (arg) => {mainActions.removeItemFromCart(dispatch,arg)},
    checkout : () => {mainActions.checkout(dispatch)}
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(CartPage)
