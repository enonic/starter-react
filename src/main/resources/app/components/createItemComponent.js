import React from 'react';
import { Form, Text } from 'react-form';

export default class CreateItem extends React.PureComponent {
    constructor(arg){
        super(arg)
        this.state = {
            formData: this.props.formData
        };
    }

    validate (value){
        /*
        error: !value || !/Hello World/.test(value) ? "Input must contain 'Hello World'" : null,
        warning: !value || !/^Hello World$/.test(value) ? "Input should equal just 'Hello World'" : null,
        success: value && /Hello World/.test(value) ? "Thanks for entering 'Hello World'!" : null
        */
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
                <Text field="image" id="image" validate={this.validate.bind(this)} />
                <button type="submit">
                    Submit
                </button>
                </form>
            )}
            </Form>)
    }
}