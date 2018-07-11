import React from 'react';
import { Form, Text, Select } from 'react-form';

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

    validate (value){
        /*
        error: !value || !/Hello World/.test(value) ? "Input must contain 'Hello World'" : null,
        warning: !value || !/^Hello World$/.test(value) ? "Input should equal just 'Hello World'" : null,
        success: value && /Hello World/.test(value) ? "Thanks for entering 'Hello World'!" : null
        */
    }

    /**
     * label
     * value 
     */
    
    getImageOptions() {
        let options = []; 
        this.state.images.map(image => {
            options.push({
                label : image.name, 
                value : image.source
            })
        })
        return options; 
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
        return (<Form onSubmit={data => this.props.submit(data)}>
            {formApi => (
                <form onSubmit={formApi.submitForm} id="form1">
                
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
    }
}