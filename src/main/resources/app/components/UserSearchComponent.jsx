/**
 * Made for testing 
 * Represents an item in the store 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Material UI 
import TextField from '@material-ui/core/TextField';
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";


export default class UserSearchComponent extends Component {
    
    constructor(props) {
        super(props); 
        this.state = {value : ""}
    }

    componentDidMount() {
        this.setState({
            value : "" 
        })
    }
    inputChange(event) {
        this.setState({
            value : event.target.value
        })
    }

    render() {
        return (
            <div>
                <TextField
                    label="Search"
                    value={this.state.value}
                    onChange={this.inputChange.bind(this)}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
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
