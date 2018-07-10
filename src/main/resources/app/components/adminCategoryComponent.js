import React from 'react';

export default class CategoryComponent extends React.PureComponent {
    constructor(arg){
        super(arg)
        
    }

    remove(){
        this.props.remove(this.props.category)
    }

    toggleVisible(){
        this.props.toggleVisible(this.props.category)
    }

    render(){
        return (
        <div key={this.props.category.id}>
            Title: {this.props.category.title} 
            <button onClick={this.toggleVisible.bind(this)}>
                visible : {this.props.visible ? "true" : "false"}
            </button>
            <button onClick={this.remove.bind(this)}>X</button>
        </div>)
    }
}