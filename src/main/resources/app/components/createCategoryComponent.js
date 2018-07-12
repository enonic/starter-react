
import React from 'react';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from '@material-ui/core/FormControl';
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default class CreateItemComponent extends React.PureComponent {
    constructor(arg) {
        super(arg)
        this.state = {
            title: "",
            visible: false,
            filter: "none"
        };
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value })
    }

    handleVisibleChange = event => {
        this.setState({visible : !this.state.visible})
    }

    render() {
        return (
            <div>
                <form>
                    <FormControl >
                        <TextField
                            label="Title"
                            id="title"
                            value={this.state.title}
                            margin="normal"
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            label="Filter"
                            id="filter"
                            value={this.state.filter}
                            margin="normal"
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="visible"
                                checked={this.state.visible}
                                onChange={this.handleVisibleChange}
                            />
                        }
                        label="Visible"
                    />

                </form>
                <DialogActions>

                    <Button onClick={() => this.props.submit(this.state)} color="primary">
                        Submit
                </Button>
                    <Button onClick={this.props.onClose.bind(this)} color="primary">
                        Cancel
                </Button>
                </DialogActions>


            </div>

        )
    }
}