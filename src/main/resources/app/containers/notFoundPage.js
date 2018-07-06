import React from 'react';

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <h1>
        This page does not exist... try another :)
      </h1>
    );
  }
}