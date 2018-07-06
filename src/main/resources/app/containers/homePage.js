import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as homePageActions from '../actions/homePageActions' 

class HomePage extends React.PureComponent { 
  
  constructor(props){
    super(props)
  }

  componentDidMount(){
  }

  render() {
    return (
      <div>
          HomePage - data: {this.props.data}
      </div>
      
    );
  }
}

HomePage.propTypes = {
    data: PropTypes.string
};

HomePage.defaultProps = {
}


function mapStateToProps(state){
	return {
      data: state.get('example').get('data')
	};
}

function mapDispatchToProps(dispatch) {
  return {
    doSomething: (arg) => {homePageActions.doSomething(dispatch,arg)},
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
