import React from 'react';
import PropTypes from 'prop-types';

import Item from '../interfaces/item';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as item from '../actions/itemActions' 

class AdminPage extends React.PureComponent { 
  
  constructor(props){
    super(props)
  }

  componentDidMount(){
  }


  addClick(event){
    this.props.createItem(new Item({name: "test"}))
  }

  render() {
    return (
      <div>
          <button onClick={this.addClick.bind(this)}>add</button>
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
