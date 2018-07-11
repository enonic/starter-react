import React from 'react';
import PropTypes from 'prop-types';

// Components
import CartItemComp from '../components/cartItemComponent';
import CheckoutComponent from '../components/checkoutComponent';
// Material UI
import Paper from '@material-ui/core/Paper'; 
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
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

  toggleCheckoutMode() {
    this.setState({ checkout: this.state.checkout ? false : true }); 
  }

  onItemsBought() {
    this.props.checkout(); 
    this.toggleCheckoutMode(); 
    this.props.history.push("/app/com.enonic.starter.react/user"); 
    this.props.openToaster("Thanks for buying!"); 
  }

  renderItems() {
    if(this.props.items.size > 0) {
      return <div>
        {this.props.items.map((item, index) => {
          return <CartItemComp item={item} key={index} remove={this.props.deleteItem} />
        })}

        <Button 
          onClick={this.toggleCheckoutMode.bind(this)} 
          fullWidth
          color="secondary">Checkout</Button>
      </div>
      
    }

    this.props.openToaster("Empty cart.")
    return <Typography variant="headline" align="center">:-/</Typography>;
  }

  render() {
    return (
      <Paper className="CartPage">
        <Typography 
          variant="headline" 
          align="center" 
          className="CartPage-Headline">Items in cart
        </Typography>
        
        {this.renderItems()}

        {this.state.checkout ?
          <CheckoutComponent
            onItemsBought={this.onItemsBought.bind(this)}
          />
          : null
        }
      </Paper>
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
