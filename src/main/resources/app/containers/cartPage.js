import React from 'react';
import PropTypes from 'prop-types';

// Components
import CartItemComp from '../components/cartItemComponent';
import CheckoutComponent from '../components/checkoutComponent';
// Material UI
import Paper from '@material-ui/core/Paper'; 
import Typography from "@material-ui/core/Typography";
// Stylesheets
import '../styles/cartPage.less'

import { connect } from 'react-redux';

// Redux Actions 
import * as mainActions from '../actions/mainActions' 
import * as toasterActions from '../actions/toasterActions'; 

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
      <div className="CartPage">
          {this.props.items.size > 0 
            ? 
              <div>
                <div>Items in cart:</div>
                <button onClick={this.checkoutClick.bind(this)}>Checkout</button>
              </div>
            : this.props.openToaster("Empty cart")
            
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
    checkout : () => {mainActions.checkout(dispatch)}, 
    openToaster: (message) => { toasterActions.showToaster(dispatch, message)}
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(CartPage)
