/**
 * Some of this (tables and forms in particular) could benefint from 
 * a refactor, as a lot of code is repeated. 
 * 
 * Do this if there is time left at the end of the project. 
 */

import React from 'react';
import PropTypes from 'prop-types';

// Components 
import ItemComponent from '../components/admin/itemComponent';
import CategoryComponent from '../components/admin/categoryComponent';
import ImageComponent from '../components/admin/imageComponent';

// Interfaces 
import Item from "../interfaces/item";
import Category from "../interfaces/category";

import { Route } from 'react-router-dom'

// Styles 
import '../styles/adminPage.less'

import * as toasterActions from '../actions/toasterActions'; 

// Material UI
import Typography from '@material-ui/core/Typography'; 


// Stylesheet 
import '../styles/adminPage.less'


import { connect } from 'react-redux';

import * as mainActions from '../actions/mainActions' 
import * as categoryActions from '../actions/categoryActions'
import * as imageActions from "../actions/imageActions"; 



class AdminPage extends React.PureComponent { 
  
  constructor(props){
    super(props)
  }

  

  

  itemSubmitClick = (data) => {
    this.setState({ dialogOpen: false }); 
    this.props.createItem(new Item({name: data.name, info: data.info, image: data.image, category: data.category}), true); 
  }

  categorySubmitClick = (data) => {
    this.setState({ dialogOpen: false }) 
    this.props.createCategory(new Category({title: data.title, filter: data.filter, visible: data.visible}), true); 
  }


  
  render() {
    return <div className="AdminPage">
        <Typography varian="display4">ADMIN</Typography>    
        <Typography varian="display2">ALL ACCESS GRANTED</Typography>   
        <Route exact path={`/app/com.enonic.starter.react/admin`} render={() => 
          <ItemComponent 
            submit={this.itemSubmitClick}
            deleteItem={this.props.deleteItem}
            editItem={this.props.editItem}
            toggleVisible={this.props.toggleItemVisible}
            items={this.props.items}
            categories={this.props.categories}
            openToaster={this.props.openToaster}
            images={this.props.images}
            addImage={this.props.addImage}
            save={this.props.saveItems}
            cancelSave={this.props.cancelItemSave}
            edited={this.props.itemEdited}
            
  
          />}  
        />
        <Route path={`/app/com.enonic.starter.react/admin/categories`} render={() => 
          <CategoryComponent 
            submit={this.categorySubmitClick}
            editCategory={this.props.editCategory}
            deleteCategory={this.props.deleteCategory} 
            categories={this.props.categories}
            toggleVisible={this.props.toggleCategoryVisible}  
            openToaster={this.props.openToaster}
            save={this.props.saveCategories}
            cancelSave={this.props.cancelCategorySave}
            edited={this.props.categoriesEdit}
          />}
        />

        <Route path={`/app/com.enonic.starter.react/admin/images`} render={() => 
          <ImageComponent 
            editImage={this.props.editImage}
            deleteImage={this.props.deleteImage} 
            images={this.props.images}
            openToaster={this.props.openToaster}
            save={this.props.saveImages}
            cancelSave={this.props.cancelImage}
            edited={this.props.imagesEdit}
            addImage={this.props.addImage}
          />}
        />
        
      </div>
  }
}



AdminPage.defaultProps = {
}


function mapStateToProps(state){
	return {
    items: state.get('app').get('allItems'),
    itemEdited: state.get('app').get('edited'),
    
    categories: state.get('categories').get('categories'), 
    categoriesEdit: state.get('categories').get('edited'),
    
    images: state.get('images').get('images'),
    imagesEdit: state.get('images').get('edited')

	};
}

function mapDispatchToProps(dispatch) {
  return {
    createItem : (arg, edit) => {mainActions.createItem(dispatch,arg, edit)},
    deleteItem : (arg) => {mainActions.deleteItem(dispatch,arg)},
    editItem : (item) => {mainActions.changeItem(dispatch,item)},
    toggleItemVisible: (arg) => {mainActions.toggleItemVisible(dispatch,arg)},  
    saveItems: () => {mainActions.save(dispatch)},
    cancelItemSave: () => {mainActions.cancelSave(dispatch)},

    createCategory : (arg, edit) => {categoryActions.createCategory(dispatch,arg, edit)},
    deleteCategory : (arg) => {categoryActions.deleteCategory(dispatch,arg)},
    editCategory : (category) => {categoryActions.changeCategory(dispatch,category)},
    toggleCategoryVisible : (arg) => {categoryActions.toggleCategoryVisible(dispatch,arg)},
    saveCategories: () => {categoryActions.save(dispatch)},
    cancelCategorySave: () => {categoryActions.cancelSave(dispatch)},

    addImage: (arg, edit) => {imageActions.addImage(dispatch, arg, edit)},
    deleteImage: (arg) => {imageActions.deleteImage(dispatch, arg)},
    editImage: (arg) => {imageActions.editImage(dispatch, arg)},
    saveImages: () => {imageActions.save(dispatch)},
    cancelSaveImages: () => {imageActions.cancelSave(dispatch)},


    openToaster: (message) => { toasterActions.showToaster(dispatch, message)}

  };
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)
