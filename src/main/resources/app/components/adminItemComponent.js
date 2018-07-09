import React from 'react';

export default class AdminItemComp extends React.PureComponent {
    constructor(arg){
        super(arg)
        
    }

    remove(){
        this.props.remove(this.props.item)
    }

    render(){
        return (
        <div>
            Hello from component {this.props.item.name}
            <button onClick={this.remove.bind(this)}>X</button>
        </div>)
    }
}