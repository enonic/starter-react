import React from 'react';

export default class AdminItemComp extends React.PureComponent {
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
            Hello from component {this.props.item.name} 
            <button onClick={this.toggleVisible.bind(this)}>
                visible : {this.props.visible ? "true" : "false"}
            
            </button>
            <button onClick={this.remove.bind(this)}>X</button>
        </div>)
    }
}