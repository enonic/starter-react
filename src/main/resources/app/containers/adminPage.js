import React from 'react';
import PropTypes from 'prop-types';

import Item from '../interfaces/item';
import Category from '../interfaces/category';

import AdminItemComponent from '../components/adminItemComponent';
import CategoryComponent from '../components/adminCategoryComponent';

import CreateItem from '../components/createItemComponent';
import CreateComponent from '../components/createCategoryComponent';


import '../styles/adminPage.less'

import { connect } from 'react-redux';

import * as mainActions from '../actions/mainActions' 
import * as categoryActions from '../actions/categoryActions'


class AdminPage extends React.PureComponent { 
  
  constructor(props){
    super(props)
    this.state = {
      showItemForm: false,
      showCategoryForm: false
    }
  }



  itemSubmitClick(data){
    this.setState({ showItemForm: false }) 
    this.props.createItem(new Item({name: data.name, info: data.info, image: data.image}))
  }

  categorySubmitClick(data){
    this.setState({ showCategoryForm: false }) 
    this.props.createCategory(new Category({title: data.title}))
  }


  addItemClick(event){
    this.setState({ showItemForm: true }) 
  }

  addCategoryClick(event){
    this.setState({ showCategoryForm: true }) 
  }

  render() {
    return (
      <div className="AdminPage">
          
          <button onClick={this.addItemClick.bind(this)}>add Item</button>
          
          {this.state.showItemForm ? <CreateItem submit={this.itemSubmitClick.bind(this)} /> : null}
          {this.props.items.map(item => 
            <AdminItemComponent 
              item = {item} 
              remove = {this.props.deleteItem}
              visible = {item.visible}
              toggleVisible = {this.props.toggleItemVisible}
            />
          )}
          
          <button onClick={this.addCategoryClick.bind(this)}>add Category</button>
          
          {this.state.showCategoryForm ? <CreateComponent submit={this.categorySubmitClick.bind(this)} /> : null}
          {this.props.categories.map(category => 
            <CategoryComponent 
              category = {category} 
              remove = {this.props.deleteCategory}
              visible = {category.visible}
              toggleVisible = {this.props.toggleCategoryVisible}
            />
          )}
      </div>
      
    );
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
    changeCategory : (item, arg) => {categoryActions.changeCategory(dispatch,item,arg)},
    toggleCategoryVisible : () => {categoryActions.toggleCategoryVisible(dispatch)},
    
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)
