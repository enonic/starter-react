import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';


import * as mainActions from '../actions/mainActions' 

// Components 
import UserItemComponent from "../components/userItemComponent"
import SearchComponent from "../components/searchComponent"; 
import DialogComponent from '../components/dialogComponent';

// Material UI 
import Grid from '@material-ui/core/Grid'; 
import Paper from '@material-ui/core/Paper'

// Stylesheets
import '../styles/userPage.less'

class UserPage extends React.PureComponent { 
  constructor(props) {
    super(props); 
    this.state = {
      searchValue: this.props.searchValue,
      dialogType: "",
      dialogOpen: false,
      displayedItem: null
    }
  }



  componentWillReceiveProps(nextProps){
    if(nextProps.searchValue !== this.props.searchValue) {
        this.setState({searchValue:nextProps.searchValue});
    }
  }

  searchOnChange(value){
    this.setState({searchValue: value })
  }

  itemOnClick = item =>{  
    this.setState({displayedItem: item, dialogOpen: true, dialogType: "ITEM_VIEW"})
  }

  renderItems() {
    return this.props.items.map((item, index) => {
      if(item.name.toUpperCase().includes(this.state.searchValue.toUpperCase()) ||
        item.category.toUpperCase().includes(this.state.searchValue.toUpperCase())
        ){ 
        if(item.visible){
          return <Grid key={index}>
              <UserItemComponent
                item={item}
                add={this.props.addItemToCart}
                onClick={this.itemOnClick}
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
        <DialogComponent 
          type={this.state.dialogType} 
          onClose={() => this.setState({ dialogType: "", dialogOpen: false })}
          addToCart={(item) => this.props.addItemToCart(item)}
          open = {this.state.dialogOpen}
          item = {this.state.displayedItem}
        />
        <SearchComponent value={this.state.searchValue} onChange={this.searchOnChange.bind(this)}/>
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
  items: PropTypes.object,
  searchValue: PropTypes.string
};

UserPage.defaultProps = {
}


function mapStateToProps(state){
	return {
    items: state.get('app').get('allItems'),
    searchValue: state.get('app').get('searchValue')
	};
}

function mapDispatchToProps(dispatch) {
  return {
    createItem: (arg) => { mainActions.createItem(dispatch, arg)}, 
    addItemToCart: (arg) => {mainActions.addItemToCart(dispatch,arg)},
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
