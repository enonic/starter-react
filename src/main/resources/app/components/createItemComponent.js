import React from 'react';

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

// Sample data 
import SampleData from '../sampleData.json'

export default class CreateItemComponent extends React.PureComponent {
    constructor(arg){
        super(arg)
        this.state = {
            images : [],
            name: "",
            info: "",
            image: "none",
            category: "none",
        };
    }

    componentDidMount() {
        this.setState({ images: SampleData.images })
    }

    
    getImageItems() {
        return this.state.images.map( (image, index) => 
            <MenuItem key={index} value={image}>{image.name}</MenuItem>
        )
    }

    getCategoryItems() {
        return this.props.categories.map( (category, index) => 
            <MenuItem key={index} value={category}>{category.title}</MenuItem>
        )
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value })
    }

    handleImageChange = event => {
        this.setState({ image: event.target.value.source})
    }

    handleCategoryChange = event => {
        this.setState({category: event.target.value.title})
    }

    render(){
        
        return (
        <div>
            <form>
                
                {this.state.image != "none" ? 
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
                    />

                    <TextField
                        label="Info"
                        id="info"
                        value={this.state.info}
                        margin="normal"
                        onChange={this.handleChange}
                    />
                
                    <FormControl>
                        <InputLabel>Image</InputLabel>
                        <Select
                            value={this.state.image}
                            name="image"
                            onChange={this.handleImageChange}
                            autoWidth
                        >
                            <MenuItem value="" disabled>
                                <em>None</em>
                            </MenuItem>
                            {this.getImageItems()}
                        </Select>
                    </FormControl>       
                    <FormControl>
                        <InputLabel>Category</InputLabel> 
                        <Select
                            value={this.state.category}
                            name="category"
                            onChange={this.handleCategoryChange}
                            autoWidth
                        >
                            <MenuItem value="" disabled>
                                <em>None</em>
                            </MenuItem>
                            {this.getCategoryItems()}
                        </Select>
                    </FormControl>
                </FormControl>

            </form>
            

        </div>
        
        
        )
    }
}

/*



                <TextField
                    id="info"
                    label="Info"
                    value={this.state.info}
                    onChange={this.handleChange('info')}
                    margin="normal"
                />
                <FormControl>
                    <InputLabel htmlFor="image">Image</InputLabel>
                    <Select
                        value={this.state.image}
                        onChange={this.handleImageChange}
                    >
                    {this.getImageOptions}
                    </Select>
                </FormControl>

<Form onSubmit={data => this.props.submit(data)}>
            {formApi => (
                
                
                <label htmlFor="hello">Name</label>
                <Text field="name" id="name" validate={this.validate.bind(this)} />
                
                <label htmlFor="hello">Info</label>
                <Text field="info" id="info" validate={this.validate.bind(this)} />
                
                <label htmlFor="hello">Image</label>                
                <Select field="image" id="image" 
                        options={this.getImageOptions()} >
                </Select>

                <label htmlFor="hello">Category</label>                
                <Select field="category" id="category" 
                        options={this.getCategoryOptions()} >
                </Select>

                <button type="submit">
                    Submit
                </button>
                </form>
            )}
            </Form>)


*/