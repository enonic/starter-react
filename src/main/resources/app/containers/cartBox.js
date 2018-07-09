import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as item from '../actions/itemActions' 

class CartBox extends React.PureComponent { 
  
  constructor(props){
    super(props)
  }

  componentDidMount(){
  }

  render() {
    return (
      <div>
          CartBox
      </div>
      
    );
  }
}

CartBox.propTypes = {
    data: PropTypes.string
};

CartBox.defaultProps = {
}


function mapStateToProps(state){
	return {
      data: state.get('example').get('data')
	};
}

function mapDispatchToProps(dispatch) {
  return {
    doSomething: (arg) => {item.doSomething(dispatch,arg)},
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(CartBox)
