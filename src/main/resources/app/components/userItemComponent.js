/**
 * Made for testing 
 * Represents an item in the store 
 */
import React, {Component} from 'react'; 
import PropTypes from "prop-types";
// Material UI 
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

// Stylesheets
import '../styles/userItemComponent.less'

export default class UserItemComponent extends Component {
    

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
            <Card className="Item-Card">
                <CardMedia
                    image={image}
                    title="Contemplative Reptile"
                    className="Item-Card-Media"
                />
                <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                        {name}
                    </Typography>
                    <Typography component="p">
                        {info}
                    </Typography>
                </CardContent>
                <CardActions> 
                    <Button onClick={this.addClick.bind(this)} size="medium" color="primary">
                        Add to cart
                    </Button>
                </CardActions>
            </Card>
        )
    }
}

UserItemComponent.propTypes = {
    name : PropTypes.string, 
    info : PropTypes.string, 
    image : PropTypes.string
};

UserItemComponent.defaultProps = {
}
