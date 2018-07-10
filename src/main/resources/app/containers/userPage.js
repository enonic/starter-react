import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as mainActions from '../actions/mainActions' 

// Components 
import UserItemComponent from "../components/userItemComponent"
import UserSearchComponent from "../components/UserSearchComponent"; 

// Material UI 
import Grid from '@material-ui/core/Grid'; 
import Paper from '@material-ui/core/Paper'

// Stylesheets
import '../styles/userPage.less'

// Interfaces
import Item from '../interfaces/item'; 


class UserPage extends React.PureComponent { 

  renderItems() {
    return this.props.items.map((item, index) => {
      return <Grid key={index}>
        <UserItemComponent
          item={item}
          add={this.props.addItemToCart}
        />
      </Grid>
    })
  }

  render() {
    return (
      <div className="UserPage">
        <UserSearchComponent />
        <Grid item xs={12}>
          <Grid container justify="center">
            {this.renderItems()}
          </Grid>
        </Grid>
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
