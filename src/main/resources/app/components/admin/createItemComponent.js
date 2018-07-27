import React from 'react';
import PropTypes from "prop-types";

// Components 
import UploadImageDialog from '../uploadImageDialog'; 
// Material UI 
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl'; 
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
// Interfaces
import Image from '../../interfaces/Image'; 


// Stylesheets 
import '../../styles/createItemComponent.less'


export default class CreateItemComponent extends React.PureComponent {
    constructor(arg){
        super(arg)
        const {itemToBeEdited} = this.props
        this.state = {
            uploadImageDialogVisible : false, 
            name: itemToBeEdited ? itemToBeEdited.name : "",
            info: itemToBeEdited ? itemToBeEdited.info : "",
            image: itemToBeEdited ? itemToBeEdited.image : "none",
            category: itemToBeEdited ? itemToBeEdited.category : "none",
            id: itemToBeEdited ? itemToBeEdited.id : null
        };
    }
    
    getImageItems() {
        return this.props.images.map((image, index) => {
            return <MenuItem key={index} value={image.source}>{image.name}</MenuItem>
        }); 
    }

    getCategoryItems() {
        return this.props.categories.map( (category, index) => 
            <MenuItem key={index} value={category.title}>{category.title}</MenuItem>
        )
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value })
    }

    handleImageChange = event => {
        this.setState({
            image : event.target.value
        }); 
    }

    handleImageUpload(image) {
        this.setState({
            image : image.source
        }); 
        this.props.addImage(image); 
    }

    handleCategoryChange = event => {
        this.setState({category: event.target.value})
    }

    validateAndSubmit = () => {
        if (this.state.name !== "" && this.state.info !== "") {
            this.props.submit(this.state);
            this.props.onClose()
        }
    }

    toggleUploadImageDialog() {
        this.setState({
            uploadImageDialogVisible : !this.state.uploadImageDialogVisible
        })
    }

    render(){
        console.log("create item component is rendering"); 

        return (
        <div className="CreateItemComponent">
            <form>
                {this.state.image !="none"? 
                    <Card className="Item-Card">
                        <CardMedia
                            image={this.state.image}
                            className="Item-Card-Media"
                        /> 
                    </Card> : null}
                    

                <FormControl >

                    <TextField
                        label="Name"
                        id="name"
                        value={this.state.name}
                        margin="normal"
                        onChange={this.handleChange}
                        required
                        error={this.state.name === ""}
                    />

                    <TextField
                        label="Info"
                        id="info"
                        value={this.state.info}
                        margin="normal"
                        onChange={this.handleChange}
                        required
                        error={this.state.info === ""}
                    />
                    <FormControl>
                        {/*<InputLabel>Category</InputLabel>*/}
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={this.state.category}
                            name="category"
                            onChange={this.handleCategoryChange}
                            autoWidth>
                            <MenuItem value="" disabled>
                                <em>None</em>
                            </MenuItem>
                            {this.getCategoryItems()}
                        </Select>
                    </FormControl>
                    <FormControl>
                        {/*<InputLabel>Category</InputLabel>*/}
                        <InputLabel>Image</InputLabel>
                        <Select
                            value={this.state.image}
                            name="image"
                            onChange={this.handleImageChange}
                            autoWidth>
                            <MenuItem value="" disabled>
                                <em>None</em>
                            </MenuItem>
                            {this.getImageItems()}
                        </Select>
                    </FormControl>  
                    <Button variant="outlined" onClick={this.toggleUploadImageDialog.bind(this)}>Custom Image</Button>
                </FormControl>
                    
            </form>
            <DialogActions>
                
                <Button onClick={this.validateAndSubmit} color="primary">
                    Submit
                </Button>
                <Button onClick={this.props.onClose.bind(this)} color="primary">
                    Cancel
                </Button>
            </DialogActions>
            {/*Displayed when user wants to upload image*/}
            <UploadImageDialog
                open={this.state.uploadImageDialogVisible}
                onClose={this.toggleUploadImageDialog.bind(this)}
                onUpload={this.handleImageUpload.bind(this)}/>
        </div>
        )
    }
}
