import React from 'react';

export default class CartItem extends React.PureComponent {
    constructor(arg){
        super(arg)
        
    }

    remove(){
        this.props.remove(this.props.item)
    }

    render(){
        return <div>
            Hello from Cart component {this.props.item.name} 
            <button onClick={this.remove.bind(this)}>X</button>
        </div>
    }
}