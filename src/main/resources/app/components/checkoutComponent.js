import React from 'react';

// Material UI 
import Button from '@material-ui/core/Button'
import Typography from "@material-ui/core/Typography";

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
            <Typography variant="display2">Buy items?</Typography>
            <Button onClick={this.buyClick.bind(this)} color="secondary">Buy</Button>
        </div>
    }
}