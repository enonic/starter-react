import React from 'react';
import PropTypes from 'prop-types';

import Item from '../interfaces/item';
import AdminItemComp from '../components/adminItemComponent';
import CreateItem from '../components/createItemComponent';

import { connect } from 'react-redux';

import * as mainActions from '../actions/mainActions' 

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
          {this.props.items.map(item => 
            <AdminItemComp 
              item = {item} 
              key = {item.id} 
              remove = {this.props.deleteItem}
              visible = {item.visible}
              toggleVisible = {this.props.toggleVisible}
            />
          )}
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
  
	return {
    items: state.get('app').get('allItems')
	};
}

function mapDispatchToProps(dispatch) {
  return {
    toggleVisible: (arg) => {mainActions.toggleVisible(dispatch,arg)},  
    createItem : (arg) => {mainActions.createItem(dispatch,arg)},
    deleteItem : (arg) => {mainActions.deleteItem(dispatch,arg)},
    changeItem : (arg) => {mainActions.changeItem(dispatch,arg)}
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)
