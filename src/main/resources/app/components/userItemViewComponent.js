/**
 * Made for testing 
 * Represents an item in the store 
 */
import React, {Component} from 'react'; 


// Material UI 
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

// Stylesheets
import '../styles/userItemComponent.less'

export default class UserItemViewComponent extends Component {
    

    addClick(){
        this.props.add(this.props.item)
    }

    render() {
        const {
            image,
            name,
            info
        } = this.props.item

        return (
            <div>
                <CardMedia
                    image={image}
                    className="Item-View-Media"
                />
                <Typography variant="headline">
                    {name}
                </Typography>
                <Typography>
                    {info}
                </Typography>
            </div>
        )
    }
}
