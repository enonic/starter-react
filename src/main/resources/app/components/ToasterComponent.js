import React from 'react';

//Material UI 
import Snackbar from "@material-ui/core/Snackbar";

export default class ToasterComponent extends React.PureComponent {
    constructor(arg){
        super(arg)
        
    }

    toggleVisible(){
        this.props.toggleVisible(this.props.item)
    }

    render(){
        const {
            visible,
            message
        } = this.props
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={visible}
                autoHideDuration={1500}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{message}</span>}
            />
        )
    }
}