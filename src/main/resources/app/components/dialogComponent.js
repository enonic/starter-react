import React from 'react';

import CreateCategoryComponent from './createCategoryComponent';
import CreateItemComponent from './createItemComponent';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});


export default class DialogComponent extends React.PureComponent { 
  
  constructor(props){
		super(props)
		this.state = {
			open: this.props.open
		};
	}

	componentWillReceiveProps(nextProps){
    if(nextProps.open !== this.state.open) {
        this.setState({open:nextProps.open});
    }
  }

	handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

	renderItemModal(){
		return 
				

	}

	renderCategoryModal(){
		return 
				
	}
  
  getButtonType(){
    switch (this.props.type) {
			case "ITEM" || "CATEGORY":
				return (
          <DialogActions>
            <Button onClick={this.props.onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Submit
            </Button>
          </DialogActions>
        )
			default:
				return null;
		}
  }

	getFormType(){
		switch (this.props.type) {
			case "ITEM":
				return <CreateItemComponent submit={this.props.itemSubmit} categories={this.props.categories}/>
			case "CATEGORY":
				return <CreateCategoryComponent submit={this.props.categorySubmit}/>
			default:
				return null;
		}
	}


  render() {
		return(
			<div>
        <Dialog
          disableBackdropClick
          open={this.state.open}
          onClose={this.props.onClose}
        >
          <DialogContent>
            {this.getFormType()}
          </DialogContent>
           {this.getButtonType()}
        </Dialog>
      </div>
		)
	}
}
