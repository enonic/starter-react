
import React from 'react';

import ItemListComponent from './itemListComponent';
import SearchComponent from '../searchComponent';
import DialogComponent from '../dialogComponent';


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
        this.state = {
            open: false,
            searchValue: "",
            dialogType: "",
            message: "",
            itemToBeRemoved: null,
            itemToBeEdited: null
        }
        
    }

    

    searchItemOnChange(value){
        this.setState({
            searchValue : value
        })
    }

    toggleDialog(type, message, item){
        if(type){
            this.setState({ dialogType: type, open: true, message: message , itemToBeRemoved: item})
        } else {
            this.setState({ dialogType: "", open: false, message: "" })
        }
    }

    editItem(item){
        this.setState({itemToBeEdited: item})
        this.toggleDialog("ITEM")
    }

    getButtons(){
        return this.props.edited ? [
        
            <Button 
                color="primary"
                variant="outlined"
                onClick={() => {
                    this.props.save()
                    this.forceUpdate()
                }} 
            >
                Save changes
            </Button>,
            <Button 
                
                color="secondary"
                variant="outlined"
                onClick={() => {
                    this.props.cancelSave()
                    this.forceUpdate()
                }} 
            >
                cancel changes
            </Button> ]
        : [
            <Button 
                disabled
                color="primary"
                variant="outlined"
            >
                Save changes
            </Button>,
            <Button 
                disabled
                color="secondary"
                variant="outlined"
            >
                cancel changes
            </Button> ]

    }


    render(){ 
        return (
            <div>
                <DialogComponent 
                    type= {this.state.dialogType} 
                    onClose={this.toggleDialog.bind(this)}
                    
                    toBeEdited={this.state.itemToBeEdited}
                    submit = {this.state.itemToBeEdited ? ((item)=>{
                        this.props.editItem(item) 
                        this.setState({itemToBeEdited: null})
                    }): this.props.submit}
                    open = {this.state.open} 
                    categories={this.props.categories}
                    
                    remove={this.props.deleteItem}
                    toBeRemoved={this.state.itemToBeRemoved}
                    
                    openToaster={this.props.openToaster} 
                    message={this.state.message}
                    
                    images={this.props.images}
                    addImage={this.props.addImage}
                />

                <Typography variant="display3" gutterBottom>
                    Items
                </Typography>
                <SearchComponent value={this.state.searchValue} onChange={this.searchItemOnChange.bind(this)}/>
                <Button 
                    onClick={()=> this.toggleDialog("ITEM")}
                    color="primary"
                    variant="outlined">
                    
                    Add new item
                </Button>
                {this.getButtons()}
                
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
                            .includes(this.state.searchValue.toUpperCase()
                            ) || item.category.toUpperCase()
                            .includes(this.state.searchValue.toUpperCase()
                            )) {
                        return <ItemListComponent 
                            toggleDialog={this.toggleDialog.bind(this)}
                            item={item} key={item.id} 
                            edit={this.editItem.bind(this)}
                            visible={item.visible} 
                            toggleVisible={this.props.toggleVisible} />;
                        }
                    })}
                    </TableBody>
                </Table>
                
                </Paper>
            </div>
        )
    }
}