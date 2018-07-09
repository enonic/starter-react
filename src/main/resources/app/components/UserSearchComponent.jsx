/**
 * Made for testing 
 * Represents an item in the store 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Material UI 
import TextField from '@material-ui/core/TextField';



export default class UserSearchComponent extends Component {
    render() {
        return (
            <div>
                <TextField
                    id="name"
                    label="Name"
                    value={"valuevalue"}
                    onChange={() => console.log("input changed")}
                    margin="normal"
                />
            </div>
        )
    }
}

UserSearchComponent.propTypes = {
    autofocus : PropTypes.bool, 
    error : PropTypes.bool
};

UserSearchComponent.defaultProps = {
    autofocus : false, 
    error : false 
}
