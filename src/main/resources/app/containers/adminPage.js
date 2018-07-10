import React from 'react';
import PropTypes from 'prop-types';

import Item from '../interfaces/item';
import Category from '../interfaces/category';

import AdminItemComponent from '../components/adminItemComponent';
import CategoryComponent from '../components/adminCategoryComponent';

import CreateItem from '../components/createItemComponent';
import CreateComponent from '../components/createCategoryComponent';


import { connect } from 'react-redux';

import * as mainActions from '../actions/mainActions' 

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
      <div style={styles}>
          
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
          {this.props.categories.map(category => {
            return <CategoryComponent 
              category = {category} 
              remove = {this.props.deleteCategory}
              visible = {category.visible}
              toggleVisible = {this.props.toggleCategoryVisible}
            />
          })}



      </div>
      
    );
  }
}

const styles = {
  position: "absolute",
  margin: "20%"
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
    categories: state.get('app').get('categories')
	};
}

function mapDispatchToProps(dispatch) {
  return {
    createItem : (arg) => {mainActions.createItem(dispatch,arg)},
    deleteItem : (arg) => {mainActions.deleteItem(dispatch,arg)},
    changeItem : (item, arg) => {mainActions.changeItem(dispatch,item, arg)},
    toggleItemVisible: (arg) => {mainActions.toggleItemVisible(dispatch,arg)},  

    createCategory : (arg) => {mainActions.createCategory(dispatch,arg)},
    deleteCategory : (arg) => {mainActions.deleteCategory(dispatch,arg)},
    changeCategory : (item, arg) => {mainActions.changeCategory(dispatch,item,arg)},
    toggleCategoryVisible : () => {mainActions.toggleCategoryVisible(dispatch)},
    
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)
