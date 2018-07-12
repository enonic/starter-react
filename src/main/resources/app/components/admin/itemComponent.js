
import React from 'react';

import ItemListComponent from './itemListComponent';
import SearchComponent from '../components/searchComponent';
import DialogComponent from '../components/dialogComponent';


// Material UI
import Paper from '@material-ui/core/Paper'; 
import Table from '@material-ui/core/Table'; 
import TableBody from '@material-ui/core/TableBody'; 
import TableHead from '@material-ui/core/TableHead'; 
import TableRow from '@material-ui/core/TableRow'; 
import TableCell from '@material-ui/core/TableCell'; 
import Typography from '@material-ui/core/Typography'; 
import Button from '@material-ui/core/Button'; 


export default class ItemComponent extends React.PureComponent {
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
            <div>
                <DialogComponent 
                    type={this.state.dialogType} 
                    onClose={() => this.setState({ dialogType: "", dialogOpen: false })}
                    itemSubmit = {this.itemSubmitClick.bind(this)}
                    categorySubmit = {this.categorySubmitClick.bind(this)}
                    open = {this.state.dialogOpen} 
                    categories={this.props.categories}
                />

                <Typography variant="display3" gutterBottom>
                    Items
                </Typography>
                <SearchComponent value={this.state.itemSearchValue} onChange={this.searchItemOnChange.bind(this)}/>
                <Button 
                    onClick={() => this.setState({ dialogType: "ITEM" , dialogOpen: true})}
                    color="primary">
                    Add new item
                </Button>
                
                <Paper>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Items</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Info</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Id</TableCell>
                        <TableCell>Visible</TableCell>
                        <TableCell>Delete</TableCell>
                        <TableCell>Edit</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.items.map(item => {
                        if (item.name.toUpperCase()
                            .includes(this.state.itemSearchValue.toUpperCase()
                            ) || item.category
                            .toUpperCase()
                            .includes(
                            this.state.categorySearchValue.toUpperCase()
                            )) {
                        return <ItemListComponent 
                            item={item} key={item.id} 
                            remove={this.props.deleteItem} 
                            edit={this.editItem}
                            visible={item.visible} 
                            toggleVisible={this.props.toggleItemVisible} />;
                        }
                    })}
                    </TableBody>
                </Table>
                </Paper>
            </div>
        )
    }
}