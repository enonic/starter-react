import React from 'react';
import PropTypes from "prop-types";

// Material UI 
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from '@material-ui/core/Typography'; 
import CardMedia from "@material-ui/core/CardMedia";
// Interfaces 
import Image from '../interfaces/image'; 
// Stylesheets
import "../styles/uploadImageDialog.less";

export default class UploadImageDialog extends React.PureComponent {
    constructor(arg) {
        super(arg)
        this.state = {
            name: this.props.image ? this.props.image.name : "", 
            source: this.props.image ? this.props.image.source : "", 
            file: null,
            validationFailed: false 
        }
    }

    componentWillReceiveProps(props){
        if(props.image) {
            this.setState({name: props.image.name, source: props.image.source});
        } else {
            this.setState({name: "", source: ""});
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
            source : this.state.source,
            file : this.state.file
        })); 
        this.props.onClose();
    }

    handleEdit(){
        this.props.edit({
            name : this.state.name, 
            source : this.state.source,
            id: this.props.image.id
        } )
        this.props.onClose();
    }
    handleNameChange(event) {
        this.setState({
            name : event.target.value
        })
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        this.setState({
            file: file,
            name: file.name,
            source: URL.createObjectURL(file)
        })
    }

    renderButton(){

        return this.props.image ? 
            <Button 
                onClick={this.handleEdit.bind(this)} 
                variant="outlined"
                color="primary">
                Save
            </Button>
            :
            <Button 
                disabled={this.state.source == "" || this.state.name == "" ? true : false}
                onClick={this.handleUpload.bind(this)} 
                variant="outlined"
                color="primary">
                Upload
            </Button>
    }
    render() {
        return <Dialog
            open={this.props.open}
            onClose={this.props.handleClose}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Upload image</DialogTitle>
            <DialogContent>
                <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Image Name"
                    type="text"
                    value={this.state.name}
                    onChange={this.handleNameChange.bind(this)}
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
                <CardMedia
                    image={this.state.source}
                    className="Item-Card-Media"
                /> 
                <label htmlFor="raised-button-file">
                    <Button
                        color={this.state.validationFailed ? "secondary" : "primary"}
                        component="span"
                        variant="outlined" >
                        Select Image 
                    </Button>
                </label>
            </DialogContent>
            <Typography>{this.state.source}</Typography>
            <DialogActions>
                <Button 
                    onClick={this.props.onClose} 
                    variant="outlined"
                    color="primary">
                    Cancel
                </Button>
                {this.renderButton()}
            </DialogActions>
        </Dialog>
    }
}
