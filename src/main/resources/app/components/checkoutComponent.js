import React from 'react';

// Material UI 
import Button from '@material-ui/core/Button'
import Typography from "@material-ui/core/Typography";

export default class CheckoutComponent extends React.PureComponent {
    constructor(arg){
        super(arg)
    }

    render(){
        return <div>
            <Typography variant="display1">Buy items?</Typography>
            <Button onClick={this.props.onItemsBought} color="secondary">Buy</Button>
        </div>
    }
}
