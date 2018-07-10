import React from 'react';

export default class CheckoutComponent extends React.PureComponent {
    constructor(arg){
        super(arg)
    }

    buyClick(){
        this.props.checkout()
        this.props.checkoutClick()
    }

    render(){
        return <div>
           Want to buy these items?
           <button onClick={this.buyClick.bind(this)}>Buy</button>
        </div>
    }
}