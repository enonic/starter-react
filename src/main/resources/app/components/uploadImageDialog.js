import React from 'react';
import PropTypes from "prop-types";

// Material UI 
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// Interfaces 
import Image from '../interfaces/image'; 
// Stylesheets
import "../styles/uploadImageDialog.less";

export default class UploadImageDialog extends React.PureComponent {
    constructor(arg) {
        super(arg)
        this.state = {
            name: "", 
            source: "", 
            validationFailed: false 
        }
    }

    handleUpload() {
        if(!this.state.source) {
            this.setState({validationFailed : true}); 
            return; 
        } 
        this.setState({
            validationFailed : false
        })

        this.props.onUpload(new Image({
            name : this.state.name, 
            source : this.state.source
        })); 
        this.props.onClose();
    }

    handleNameChange(event) {
        let newName = event.target.value; 
        this.setState({
            name : newName
        })
    }

    handleFileChange(event) {
        let source = URL.createObjectURL(event.target.files[0]); 
        this.setState({
            source : source
        })
    }

    render() {
        return <Dialog
            open={this.props.open}
            onClose={this.props.handleClose}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Image Name"
                    type="text"
                    onInput={this.handleNameChange.bind(this)}
                    fullWidth
                />
                <input
                    accept="image/*"
                    id="raised-button-file"
                    type="file"
                    onInput={this.handleFileChange.bind(this)}
                    className="UploadImageDialog-FileInput"
                    required
                />
                <label htmlFor="raised-button-file">
                    <Button
                        color={this.state.validationFailed ? "secondary" : "primary"}
                        component="span">
                        Select Image
                    </Button>
                    {this.state.source || "none added"}
                </label>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.props.onClose} color="primary">
                    Cancel
            </Button>
                <Button onClick={this.handleUpload.bind(this)} color="primary">
                    Upload
            </Button>
            </DialogActions>
        </Dialog>
    }
}
