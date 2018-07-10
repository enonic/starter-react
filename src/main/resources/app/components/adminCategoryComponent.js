import React from 'react';

export default class CategoryComponent extends React.PureComponent {
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
        return (
        <div key={this.props.category.id}>
            Title: {this.props.category.title} 
            <button onClick={this.toggleVisible.bind(this)}>
                visible : {this.props.visible ? "true" : "false"}
            </button>
            <button onClick={this.remove.bind(this)}>X</button>
        </div>)
        return <TableRow className="AdminCategoryComponent">
            <TableCell component="th" scope="row">
                {this.props.name}
            </TableCell>
            <TableCell>{this.props.category.title}</TableCell>
            <TableCell>
                <Checkbox
                    checked={this.props.item.visible ? true : false}
                    onChange={this.toggleVisible.bind(this)} />
            </TableCell>
            <TableCell>
                <IconButton onClick={() => this.remove(this.props.item.id)}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton onClick={() => this.edit(this.props.item.id)}>
                    <EditIcon />
                </IconButton>
            </TableCell>
        </TableRow>;
    }
}