import React from 'react';
import PropTypes from 'prop-types';

import Item from '../interfaces/item';
import AdminItemComp from '../components/adminItemComponent';
import CreateItem from '../components/createItemComponent';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as item from '../actions/itemActions' 

class AdminPage extends React.PureComponent { 
  
  constructor(props){
    super(props)
    this.state = {
      showForm: false
    }
  }

  componentDidMount(){
  }

  submitClick(data){
    this.setState({ showForm: false }) 
    this.props.createItem(new Item({name: data.name}))
  
  }

  addClick(event){
    this.setState({ showForm: true }) 
  }

  render() {
    return (
      <div>
          <button onClick={this.addClick.bind(this)}>add</button>
          
          {this.state.showForm ? <CreateItem submit={this.submitClick.bind(this)} /> : null}
          {this.props.items.map(item => {
            return <AdminItemComp item={item} key={Math.random()} remove={this.props.deleteItem}/>
          })}
      </div>
      
    );
  }
}

AdminPage.propTypes = {
  items: PropTypes.object
};

AdminPage.defaultProps = {
}


function mapStateToProps(state){
  console.log(state)
	return {
    items: state.get('app').get('allItems')
	};
}

function mapDispatchToProps(dispatch) {
  return {
    createItem : (arg) => {item.createItem(dispatch,arg)},
    deleteItem : (arg) => {item.deleteItem(dispatch,arg)},
    changeItem : (arg) => {item.changeItem(dispatch,arg)}
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)
