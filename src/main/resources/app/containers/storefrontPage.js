import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';


import * as mainActions from '../actions/mainActions' 

// Components 
import StorefrontItemComponent from "../components/storefront/storefrontItemComponent"
import SearchComponent from "../components/searchComponent"; 
import DialogComponent from '../components/dialogComponent';

// Material UI 
import Grid from '@material-ui/core/Grid'; 
import Paper from '@material-ui/core/Paper'

// Stylesheets
import '../styles/storefront/StorefrontPage.less'

class StorefrontPage extends React.PureComponent { 
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

  componentWillUnmount() {
    this.props.searchCategory("")
  }

  renderItems() {
    return this.props.items.map((item, index) => {
      if(item.name.toUpperCase().includes(this.state.searchValue.toUpperCase()) ||
        item.category.toUpperCase().includes(this.state.searchValue.toUpperCase())
        ){ 
        if(item.visible){
          return <Grid key={index} item xs={12} lg={4} xl={3}>
              <StorefrontItemComponent
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
      <div className="StorefrontPage">
        <DialogComponent 
          type={this.state.dialogType} 
          onClose={() => this.setState({ dialogType: "", dialogOpen: false })}
          addToCart={(item) => this.props.addItemToCart(item)}
          open = {this.state.dialogOpen}
          item = {this.state.displayedItem}
        />
        <SearchComponent 
          value={this.state.searchValue} 
          onChange={this.searchOnChange.bind(this)} 
          className="StorefrontPage-Search"/>
        <Grid 
          container 
          item 
          spacing={24} 
          alignContent="center" 
          className="Storefront-Item-Grid-Container" 
        >
          {this.renderItems()}
        </Grid>
      </div>
    );
  }
}

StorefrontPage.propTypes = {
  items: PropTypes.object,
  searchValue: PropTypes.string
};

StorefrontPage.defaultProps = {
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
    searchCategory: (arg) => {mainActions.searchCategory(dispatch, arg)}
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(StorefrontPage)
