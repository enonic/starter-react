import React from 'react';


import Modal from 'react-responsive-modal';
import CreateCategoryComponent from './createCategoryComponent';
import CreateItemComponent from './createItemComponent';


export default class ModalComponent extends React.PureComponent { 
  
  constructor(props){
    super(props)
    this.state = {
			open: false,
			type: this.props.type
    }
  }

	componentWillReceiveProps(nextProps){
    if(nextProps.type !== this.state.type) {
        this.setState({type: nextProps.type});
    }
  }

  onCloseModal = () => {
		this.setState({ open: false, type: "" });
		this.props.onClose()
  };

  // 
  //{this.state.showCategoryForm ?  : null}

  /*
  <div>
        
  */
	renderItemModal(){
		this.setState({open: true})

		return <Modal open={this.state.open} onClose={this.onCloseModal} center>
				<h2>Item Modal</h2>
				<CreateItemComponent submit={this.props.itemSubmit} categories={this.props.categories}/>
			</Modal>
	}

	renderCategoryModal(){
		this.setState({open: true})

		return <Modal open={this.state.open} onClose={this.onCloseModal} center>
				<h2>Category Modal</h2>
				<CreateCategoryComponent submit={this.props.categorySubmit}/>
			</Modal>
	}
	

  render() {

		switch (this.state.type){
			case "ITEM":
				return this.renderItemModal()
			case "CATEGORY":
				return this.renderCategoryModal()
			default:
				return null;
		}
  }
}
