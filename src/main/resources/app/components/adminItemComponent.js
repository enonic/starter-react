import React from 'react';

// Material UI 
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";


export default class AdminItemComponent extends React.PureComponent {
    constructor(arg){
        super(arg)
        
    }

    /*
    remove() {
        this.props.remove(this.props.item);
    }

    toggleVisible() {
        this.props.toggleVisible(this.props.item);
    }

    removeItem(id) {
        console.log("remove", id); 
    }
    
    editItem(id) {
        console.log("edit", id);
    }
    */

    toggleVisible(){
        this.props.toggleVisible(this.props.item)
    }

    render(){ 
        console.log(this.props.item.visible); 
        return <TableRow className="AdminItemComponent">
            <TableCell component="th" scope="row">
                {this.props.name}
            </TableCell>
            <TableCell>{this.props.item.name}</TableCell>
            <TableCell>{this.props.item.info}</TableCell>
            <TableCell>{this.props.item.image}</TableCell>
            <TableCell>{this.props.item.id}</TableCell>
            <TableCell>
                <Checkbox 
                    checked={this.props.item.visible ? true : false}
                    onChange={this.toggleVisible.bind(this)}
                />
            </TableCell>
            <TableCell>
                <IconButton onClick={() => this.props.remove(this.props.item)}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton onClick={() => console.error("not yet implemented", this.props.id)}>
                    <EditIcon />
                </IconButton>
            </TableCell>
        </TableRow>;
    }
}
// ADD VISIBILITY TOGGLE 

