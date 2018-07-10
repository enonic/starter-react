import React from 'react';
import { Form, Text, Select } from 'react-form';

// Sample data 
import SampleData from '../sampleData.json'

export default class CreateCategory extends React.PureComponent {
    constructor(arg){
        super(arg)
        this.state = {
            formData: this.props.formData
        };
    }

    componentDidMount() {
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
   
    render(){
        return (<Form onSubmit={data => this.props.submit(data)}>
            {formApi => (
                <form onSubmit={formApi.submitForm} id="form1">
                
                <label htmlFor="hello">Title</label>
                <Text field="title" id="title" validate={this.validate.bind(this)} />
                
                <label htmlFor="hello">Filter</label>
                <Text field="filter" id="filter" validate={this.validate.bind(this)} />

                <button type="submit">
                    Submit
                </button>
                </form>
            )}
            </Form>)
    }
}