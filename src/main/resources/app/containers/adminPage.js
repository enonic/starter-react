/**
 * Some of this (tables and forms in particular) could benefint from 
 * a refactor, as a lot of code is repeated. 
 * 
 * Do this if there is time left at the end of the project. 
 */

import React from 'react';
import PropTypes from 'prop-types';

// Components 
import AdminItemComponent from '../components/adminItemComponent';
import CategoryComponent from '../components/adminCategoryComponent';
import SearchComponent from '../components/searchComponent';
import DialogComponent from '../components/dialogComponent';
// Interfaces 
import Item from "../interfaces/item";
import Category from "../interfaces/category";

// Styles 
import '../styles/adminPage.less'

import * as repo from '../services/repoService';


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
import * as imageActions from "../actions/imageActions"; 



class AdminPage extends React.PureComponent { 
  
  constructor(props){
    super(props)
    this.state = {
      itemSearchValue: "",
      categorySearchValue: "",
      dialogType: "",
      dialogOpen: false
    }
  }

  searchItemOnChange(value){
    this.setState({
      itemSearchValue : value
    })
  }

  searchCategoryOnChange(value){
    this.setState({
      categorySearchValue : value
    })
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

        <DialogComponent 
          type={this.state.dialogType} 
          onClose={() => this.setState({ dialogType: "", dialogOpen: false })}
          itemSubmit = {this.itemSubmitClick.bind(this)}
          categorySubmit = {this.categorySubmitClick.bind(this)}
          images={this.props.images}
          open = {this.state.dialogOpen} 
          categories={this.props.categories}
        />

        <Typography variant="display3" gutterBottom>
          Items
        </Typography>
        <SearchComponent value={this.state.itemSearchValue} onChange={this.searchItemOnChange.bind(this)}/>
        <Button 
          onClick={() => this.setState({ dialogType: "ITEM" , dialogOpen: true})}
          color="primary"> 
          Add new item
        </Button>
        
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Items</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Info</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Id</TableCell>
                <TableCell>Visible</TableCell>
                <TableCell>Delete</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.items.map(item => {
                if (item.name.toUpperCase()
                    .includes(this.state.itemSearchValue.toUpperCase()
                    ) || item.category
                    .toUpperCase()
                    .includes(
                      this.state.categorySearchValue.toUpperCase()
                    )) {
                  return <AdminItemComponent 
                    item={item} key={item.id} 
                    remove={this.props.deleteItem} 
                    edit={this.editItem}
                    visible={item.visible} 
                    toggleVisible={this.props.toggleItemVisible} />;
                }
              })}
            </TableBody>
          </Table>
        </Paper>

        <Typography variant="display3" gutterBottom>
          Categories
        </Typography>

        <SearchComponent value={this.state.categorySearchValue} onChange={this.searchCategoryOnChange.bind(this)}/>
        <Button 
          onClick={() => this.setState({ dialogType: "CATEGORY" , dialogOpen: true})}
          color="primary">
          add Category
        </Button>
        

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Filter</TableCell>
                <TableCell>Visible</TableCell>
                <TableCell>Delete</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.categories.map(category => {
                if (category.title.toUpperCase()
                    .includes(this.state.categorySearchValue.toUpperCase()
                    )) {
                  return <CategoryComponent 
                    category={category} 
                    key={category.id} 
                    remove={this.props.deleteCategory} 
                    visible={category.visible} 
                    toggleVisible={this.props.toggleCategoryVisible} />;
                }
              })}
            </TableBody>
          </Table>
        </Paper>
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
    categories: state.get('categories'), 
    images: state.get('images')
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
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)
