import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as item from '../actions/itemActions' 

class UserPage extends React.PureComponent { 
  
  constructor(props){
    super(props)
  }

  componentDidMount(){
  }

  render() {
    return (
      <div>
          UserPage
      </div>
      
    );
  }
}

UserPage.propTypes = {
    data: PropTypes.string
};

UserPage.defaultProps = {
}


function mapStateToProps(state){
	return {
      // data: state.get('example').get('data')
	};
}

function mapDispatchToProps(dispatch) {
  return {
    doSomething: (arg) => {item.doSomething(dispatch,arg)},
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
