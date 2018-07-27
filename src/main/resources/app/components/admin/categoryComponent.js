
import React from 'react';

import CategoryListComponent from './categoryListComponent';
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


export default class CategoryComponent extends React.PureComponent {
    constructor(arg){
        super(arg)
        this.state = {
            open : false,
            searchValue: "",
            dialogType: "",
            message: "",
            categoryToBeRemoved: "",
            categoryToBeEdited: null
        }
    }

    searchCategoryOnChange(value){
        this.setState({
          searchValue : value
        })
      }

    toggleDialog(type, message, category){
        if(type){
            this.setState({ dialogType: type, open: true, message: message, categoryToBeRemoved: category })
        } else {
            this.setState({ dialogType: "", open: false, message: "" })
        }
    }

    editCategory(category){
        this.setState({categoryToBeEdited: category})
        this.toggleDialog("CATEGORY")
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
                    open = {this.state.open} 
                    type= {this.state.dialogType} 
                    onClose={this.toggleDialog.bind(this)}
                    submit = {this.state.categoryToBeEdited ? ((category)=> {
                        this.props.editCategory(category)
                        this.setState({categoryToBeEdited: null})
                    }) : this.props.submit}
                    message={this.state.message}
                    remove={this.props.deleteCategory}
                    openToaster={this.props.openToaster} 
                    toBeRemoved={this.state.categoryToBeRemoved}
                    toBeEdited={this.state.categoryToBeEdited}
                    
                />

                <Typography variant="display3" gutterBottom>
                    Categories
                </Typography>

                <SearchComponent value={this.state.searchValue} onChange={this.searchCategoryOnChange.bind(this)}/>
                <Button 
                    onClick={() => this.toggleDialog("CATEGORY")}
                    color="primary"
                    variant="outlined">
                    add Category
                </Button>
                {this.getButtons()}
                

                <Paper>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Filter</TableCell>
                            <TableCell>Visible</TableCell>
                            <TableCell>Delete</TableCell>
                            <TableCell>Edit</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.props.categories.map(category => {
                            if (category.title.toUpperCase()
                                .includes(this.state.searchValue.toUpperCase()
                                )) {
                            return <CategoryListComponent 
                                toggleDialog={this.toggleDialog.bind(this)}
                                category={category} 
                                key={category.id} 
                                visible={category.visible} 
                                toggleVisible={this.props.toggleVisible} 
                                edit={this.editCategory.bind(this)}
                            />;

                            }
                        })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}