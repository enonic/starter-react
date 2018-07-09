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

export default class UserItemComponent extends Component {

    render() {
        console.log(this.props.image); 
        return (
            <Card className="Card">
                <CardMedia
                    style={styles}
                    image={this.props.image}
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                        {this.props.name}
                    </Typography>
                    <Typography component="p">
                        {this.props.info}
                    </Typography>
                </CardContent>
                <CardActions> 
                    <Button size="medium" color="primary">
                        Add to cart
                    </Button>
                </CardActions>
            </Card>
        )
    }
}

const styles = {
    card: {
        maxWidth: 345,
    },
    media: {
        height: "200px",
        paddingTop: '56.25%', // 16:9
    },
};

UserItemComponent.propTypes = {
    name : PropTypes.string, 
    info : PropTypes.string, 
    image : PropTypes.string
};

UserItemComponent.defaultProps = {
}
