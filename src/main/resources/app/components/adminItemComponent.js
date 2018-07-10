import React from 'react';

export default class AdminItemComponent extends React.PureComponent {
    constructor(arg){
        super(arg)
        
    }

    remove(){
        this.props.remove(this.props.item)
    }

    toggleVisible(){
        this.props.toggleVisible(this.props.item)
    }

    render(){
        return (
        <div>
            Name: {this.props.item.name} 
            Info: {this.props.item.info}
            Image: {this.props.image}
            <button onClick={this.toggleVisible.bind(this)}>
                visible : {this.props.visible ? "true" : "false"}
            </button>
            <button onClick={this.remove.bind(this)}>X</button>
        </div>)
    }
}