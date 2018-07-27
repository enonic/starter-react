/**
 * Made for testing 
 * Represents an item in the store 
 */
import React, {Component} from 'react'; 


// Material UI 
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import ButtonBase from '@material-ui/core/ButtonBase';
// Stylesheets
import "../styles/cartPage.less";

import SampleData from '../sampleData.json';

export default class CheckoutComponent extends Component {
    

    addClick(){
        this.props.add(this.props.item)
    }
    
    renderMedia(){
        return SampleData.cardImages.map((image,index) => 
            <ButtonBase onClick={this.props.onItemsBought} key={index}>
                <CardMedia
                    image={image}
                    className="CartPage-Card-Media"
                />
            </ButtonBase>
        )
    }

    render() {

        return (
            <div>
                
                <Typography variant="headline">
                    {this.renderMedia()}
                </Typography>
            </div>
        )
    }
}
