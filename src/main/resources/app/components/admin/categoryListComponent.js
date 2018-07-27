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

    render(){ 
        let styleClass = this.props.category.edited ? "adminListComponent-edited" : "adminListComponent"
        return <TableRow className={styleClass}>
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
                <IconButton onClick={() => this.props.toggleDialog("DELETE", this.props.category.title, this.props.category)}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton onClick={() => this.props.edit(this.props.category)}>
                    <EditIcon />
                </IconButton>
            </TableCell>
        </TableRow>;
    }
}