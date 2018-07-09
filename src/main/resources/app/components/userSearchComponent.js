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

    handleKeyDown(event) {
                        //  ENTER 
        if(event.keyCode === 13) {
            if(this.props.onEnter) {
                // Put the value in the redux store from parent component 
                this.props.onEnter(this.state.value); 
            }
        }
    }

    render() {
        return (
            <div>
                <TextField
                    label="Search"
                    value={this.state.value}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    helperText="Search in store"
                    onChange={this.inputChange.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)}
                />
            </div>
        )
    }
}

UserSearchComponent.propTypes = {
    autofocus : PropTypes.bool, 
    error : PropTypes.bool,
    onEnter : PropTypes.func
};

UserSearchComponent.defaultProps = {
    autofocus : false, 
    error : false 
}
