/**
 * Some of this (tables and forms in particular) could benefint from 
 * a refactor, as a lot of code is repeated. 
 * 
 * Do this if there is time left at the end of the project. 
 */

import React from 'react';
import PropTypes from 'prop-types';

// Components 
import Item from '../interfaces/item';
import Category from '../interfaces/category';
import ItemComponent from '../components/admin/itemComponent';
import CategoryComponent from '../components/admin/categoryComponent';
import SearchComponent from '../components/searchComponent';
import DialogComponent from '../components/dialogComponent';

import { Route } from 'react-router-dom'

// Styles 
import '../styles/adminPage.less'

import * as repo from '../services/repoService';
import * as toasterActions from '../actions/toasterActions'; 

// Material UI
import Paper from '@material-ui/core/Paper'; 
import Table from '@material-ui/core/Table'; 
import TableBody from '@material-ui/core/TableBody'; 
import TableHead from '@material-ui/core/TableHead'; 
import TableRow from '@material-ui/core/TableRow'; 
import TableCell from '@material-ui/core/TableCell'; 
import Typography from '@material-ui/core/Typography'; 
import Button from '@material-ui/core/Button'; 

// Stylesheet 
import '../styles/adminPage.less'


import { connect } from 'react-redux';

import * as mainActions from '../actions/mainActions' 
import * as categoryActions from '../actions/categoryActions'


class AdminPage extends React.PureComponent { 
  
  constructor(props){
    super(props)
  }

  

  

  itemSubmitClick(data){
    this.setState({ dialogOpen: false }); 
    this.props.createItem(new Item({name: data.name, info: data.info, image: data.image, category: data.category})); 
  }

  categorySubmitClick(data){
    this.setState({ dialogOpen: false }) 
    this.props.createCategory(new Category({title: data.title, filter: data.filter, visible : data.visible})); 
  }
  
  editItem(item) {
    console.log("edit me please! it's not implemented!!", item); 

  }

  editTestMethod(newValues) {
    console.log(newValues); 
  }
  

  render() {
    return <div className="AdminPage">
        <Typography varian="display4">ADMIN</Typography>    
        <Typography varian="display2">ALL ACCESS GRANTED</Typography>   
        <Route exact path={`/app/com.enonic.starter.react/admin`} render={() => 
          <ItemComponent 
            submit={this.itemSubmitClick}
            deleteItem={this.props.deleteItem}
            items={this.props.items}
            categories={this.props.categories}
            toggleVisible={this.props.toggleItemVisible}
            openToaster={this.props.openToaster}
          
          />}  
        />
        <Route path={`/app/com.enonic.starter.react/admin/categories`} render={() => 
          <CategoryComponent 
            submit={this.categorySubmitClick}
            deleteCategory={this.props.deleteCategory} 
            categories={this.props.categories}
            toggleVisible={this.props.toggleCategoryVisible}  
            openToaster={this.props.openToaster}
          />}
        />
        
      </div>
  }
}

AdminPage.propTypes = {
  items: PropTypes.object,
  categories: PropTypes.object
};

AdminPage.defaultProps = {
}


function mapStateToProps(state){
	return {
    items: state.get('app').get('allItems'),
    categories: state.get('categories')
	};
}

function mapDispatchToProps(dispatch) {
  return {
    createItem : (arg) => {mainActions.createItem(dispatch,arg)},
    deleteItem : (arg) => {mainActions.deleteItem(dispatch,arg)},
    changeItem : (item, arg) => {mainActions.changeItem(dispatch,item, arg)},
    toggleItemVisible: (arg) => {mainActions.toggleItemVisible(dispatch,arg)},  

    createCategory : (arg) => {categoryActions.createCategory(dispatch,arg)},
    deleteCategory : (arg) => {categoryActions.deleteCategory(dispatch,arg)},
    changeCategory : (category, arg) => {categoryActions.changeCategory(dispatch,category,arg)},
    toggleCategoryVisible : (arg) => {categoryActions.toggleCategoryVisible(dispatch,arg)},

    openToaster: (message) => { toasterActions.showToaster(dispatch, message)}
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)
