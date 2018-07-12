import React from 'react';

// Material UI 
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

export default class CategoryListComponent extends React.PureComponent {
    constructor(arg){
        super(arg)
        
    }

    remove() {
        this.props.remove(this.props.category)
    }

    toggleVisible() {
        this.props.toggleVisible(this.props.category)
    }

    edit() {
        console.error("edit category not implemented"); 
    }

    render(){ 
        return <TableRow className="AdminCategoryComponent">
            <TableCell component="th" scope="row">
                {this.props.category.title}
            </TableCell>
            <TableCell component="th" scope="row">
                {this.props.category.filter}
            </TableCell>
            <TableCell>
                <Checkbox
                    checked={this.props.category.visible ? true : false}
                    onChange={this.toggleVisible.bind(this)} />
            </TableCell>
            <TableCell>
                <IconButton onClick={() => this.remove(this.props.category.id)}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton onClick={() => this.edit(this.props.category.id)}>
                    <EditIcon />
                </IconButton>
            </TableCell>
        </TableRow>;
    }
}