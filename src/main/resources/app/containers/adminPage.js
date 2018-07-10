import React from 'react';
import PropTypes from 'prop-types';

// Components 
import Item from '../interfaces/item';
import AdminItemComponent from '../components/adminItemComponent';
import CreateItem from '../components/createItemComponent';

// Styles 
import '../styles/adminPage.less'

// Material UI
import Paper from '@material-ui/core/Paper'; 
import Table from '@material-ui/core/Table'; 
import TableBody from '@material-ui/core/TableBody'; 
import TableHead from '@material-ui/core/TableHead'; 
import TableRow from '@material-ui/core/TableRow'; 
import TableCell from '@material-ui/core/TableCell'; 

// Stylesheet 
import '../styles/adminPage.less'


import { connect } from 'react-redux';

import * as mainActions from '../actions/mainActions' 

class AdminPage extends React.PureComponent { 
  
  constructor(props){
    super(props)
    this.state = {
      showForm: false
    }
  }



  submitClick(data){
    this.setState({ showForm: false }) 
    this.props.createItem(new Item({name: data.name, info: data.info, image: data.image}))
  }

  addClick(event){
    this.setState({ showForm: true }) 
  }

  render() {
    return <div className="AdminPage">
        <button onClick={this.addClick.bind(this)}>add</button>
        {this.state.showForm ? <CreateItem submit={this.submitClick.bind(this)} /> : null}

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Items</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Info</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Id</TableCell>
                <TableCell>Visible</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.items.map(item => (
                <AdminItemComponent
                  item={item}
                  key={item.id}
                  remove={this.props.deleteItem}
                  visible={item.visible}
                  toggleVisible={this.props.toggleVisible}
                />
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>;
  }
}

AdminPage.propTypes = {
  items: PropTypes.object
};

AdminPage.defaultProps = {
}


function mapStateToProps(state){
  console.log(state.get("app").get("allItems"));
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
