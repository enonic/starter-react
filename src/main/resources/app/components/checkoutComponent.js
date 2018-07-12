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
import '../styles/userItemComponent.less'

import SampleData from '../sampleData.json';

export default class CheckoutComponent extends Component {
    

    addClick(){
        this.props.add(this.props.item)
    }
    
    renderMedia(){
        console.log(this.props); 
        return SampleData.cardImages.map((image,index) => 
            <div onClick={this.props.onItemsBought}>
                <CardMedia
                    key={index}
                    image={image}
                    className="CartPage-Card-Media"
                />
            </div>
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
