/**
 * Searchbar. 
 * Has its current input value as state. 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Material UI 
import TextField from '@material-ui/core/TextField';
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import { MDCChipSet } from '@material/chips';

// Stylesheets
import '../styles/searchComponent.less'


export default class SearchComponent extends Component {
    
    constructor(props) {
        super(props); 
        this.state = {
            value : this.props.value
        }
    }


    componentWillReceiveProps(nextProps){
        if(nextProps.value !== this.props.value) {
            this.setState({value:nextProps.value});
        }
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

    onChange(event){
        this.setState({
            value : event.target.value
        })
        this.props.onChange(event.target.value)
    }

    render() {

        return (
            
            <div className="SearchComponent">
                <TextField
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
                    onChange={this.onChange.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)}
                    autoFocus
                    fullWidth={true}
                />
            </div>
        )
    }
}

SearchComponent.propTypes = {
    // autofocus : PropTypes.bool, 
    error : PropTypes.bool,
    onEnter : PropTypes.func
};

SearchComponent.defaultProps = {
    // autofocus : false, 
    error : false 
}
