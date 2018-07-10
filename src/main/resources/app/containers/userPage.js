import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';


import * as mainActions from '../actions/mainActions' 

// Components 
import UserItemComponent from "../components/userItemComponent"
import SearchComponent from "../components/searchComponent"; 

// Material UI 
import Grid from '@material-ui/core/Grid'; 
import Paper from '@material-ui/core/Paper'

// Stylesheets
import '../styles/userPage.less'

class UserPage extends React.PureComponent { 
  constructor(props) {
    super(props); 
    this.state = {
        value : ""
    }
  }

  searchOnChange(value){
    this.setState({
      value : value
    })
  }

  renderItems() {
    return this.props.items.map((item, index) => {
      if(item.name.toUpperCase().includes(this.state.value.toUpperCase()) ||
        item.category.toUpperCase().includes(this.state.value.toUpperCase())
        ){ 
        if(item.visible){
          return <Grid key={index}>
              <UserItemComponent
                item={item}
                add={this.props.addItemToCart}
              />
            </Grid>
          }

        }
      return null
    })
  }

 

  render() {
    return (
      <div className="UserPage">
        <SearchComponent value={this.state.value} onChange={this.searchOnChange.bind(this)}/>
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
