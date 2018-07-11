import React from 'react';
import MaterialUIForm from 'material-ui-form'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';

import '../styles/popup.less'

// Sample data 
import SampleData from '../sampleData.json'

export default class CreateItemComponent extends React.PureComponent {
    constructor(arg){
        super(arg)
        this.state = {
            formData: this.props.formData, 
            images : []
        };
    }

    componentDidMount() {
        this.setState({ images: SampleData.images })
    }

    /**
     * label
     * value 
     */
    
    getImageOptions() {
        return this.state.images.map(image => 
            <MenuItem value={image}>{image.name}</MenuItem>
        )
    }

    getCategoryOptions() {
        let options = []; 
        this.props.categories.map(category => {
            options.push({
                label : category.title, 
                value : category.title
            })
        })
        return options; 
    }

    render(){
        return (
        <div className='popup'>

        </div>
        
        
        )
    }
}

/*

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