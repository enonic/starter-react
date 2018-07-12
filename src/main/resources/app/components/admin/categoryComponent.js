
import React from 'react';

import CategoryListComponent from './categoryListComponent';
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
            <div>
                <DialogComponent 
                    type={this.state.dialogType} 
                    onClose={() => this.setState({ dialogType: "", dialogOpen: false })}
                    categorySubmit = {this.categorySubmitClick.bind(this)}
                    open = {this.state.dialogOpen} 
                />

                <Typography variant="display3" gutterBottom>
                    Categories
                </Typography>

                <SearchComponent value={this.state.categorySearchValue} onChange={this.searchCategoryOnChange.bind(this)}/>
                <Button 
                    onClick={() => this.setState({ dialogType: "CATEGORY" , dialogOpen: true})}
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
                                .includes(this.state.categorySearchValue.toUpperCase()
                                )) {
                            return <CategoryComponent 
                                category={category} 
                                key={category.id} 
                                remove={this.props.deleteCategory} 
                                visible={category.visible} 
                                toggleVisible={this.props.toggleCategoryVisible} />;
                            }
                        })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}