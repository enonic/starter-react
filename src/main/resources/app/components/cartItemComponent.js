import React from 'react';

// Material UI 
import ListItem from "@material-ui/core/ListItem"; 
import ListItemText from "@material-ui/core/ListItemText"; 
import IconButton from "@material-ui/core/IconButton"; 
import DeleteIcon from "@material-ui/icons/Delete"; 
import Avatar from "@material-ui/core/Avatar"; 

export default class CartItem extends React.PureComponent {
    constructor(arg){
        super(arg)
        
    }

    remove(){
        this.props.remove(this.props.item)
    }

    render(){
        return <ListItem>
            <ListItemText>{this.props.item.name}</ListItemText>
            <Avatar src={this.props.item.image} ></Avatar>
            <IconButton onClick={this.remove.bind(this)}>
                <DeleteIcon/>
            </IconButton>
        </ListItem>
    }
}