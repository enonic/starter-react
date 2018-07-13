
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
        }
    }

    searchCategoryOnChange(value){
        this.setState({
          searchValue : value
        })
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
                    type="CATEGORY" 
                    onClose={() => this.setState({ open: false })}
                    categorySubmit = {this.props.categorySubmitClick}
                    open = {this.state.open} 
                />

                <Typography variant="display3" gutterBottom>
                    Categories
                </Typography>

                <SearchComponent value={this.state.searchValue} onChange={this.searchCategoryOnChange.bind(this)}/>
                <Button 
                    onClick={() => this.setState({ open: true})}
                    color="primary">
                    add Category
                </Button>
                

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
                                category={category} 
                                key={category.id} 
                                remove={this.props.deleteCategory} 
                                visible={category.visible} 
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