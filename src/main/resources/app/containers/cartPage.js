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


  checkoutClick(){
    this.setState({checkout : this.state.checkout ? false : true})
  }

  render() {
    return (
      <div style={styles}>
          {this.props.items.size > 0 
            ? 
              <div>
                <div>Items in cart:</div>
                <button onClick={this.checkoutClick.bind(this)}>Checkout</button>
              </div>

            : <div>You have no items in your cart</div>
             
          }
          
          {this.props.items.map(item => 
            <CartItemComp 
              item = {item} 
              key = {item.id} 
              remove = {this.props.deleteItem}
            />
          )}

          {this.state.checkout ? 
            <CheckoutComponent
              checkout={this.props.checkout}
              checkoutClick={this.checkoutClick.bind(this)}
            />
            : null
          }
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
