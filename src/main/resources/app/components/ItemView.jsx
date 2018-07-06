/**
 * Made for testing 
 * Represents an item in the store 
 * The state in this component is for testing only! Redux will be used for storing items 
 */
import React, { Component } from 'react';

// Components 
import Item from './Item'

export default class ItemView extends Component {
    constructor() {
        super(); 
        this.state = {items : []}
    }
    componentDidMount() {
        this.setState({
            items : [
                {
                    name : "Støvler",
                    info : "Fine støvler for turer i all slags vær! (sol?)", 
                    image : "images/stovler.png"
                }, 
                {
                    name: "T-skjorte",
                    info: "Fantastisk skjorte for alle!)",
                    image: "images/tskjorte.png"
                }, 
                {
                    name: "Jeans var. 1",
                    info: "Fantastisk jeans for de som liker å være først ute!",
                    image: "images/jeans1.png"
                }, 
                {
                    name: "Jeans var. 2",
                    info: "Fantastisk jeans for de som liker å være nummer to!",
                    image: "images/jeans2.png"
                }
            ]
        })
    }
    renderItems() {
        return this.state.items.map(item => {
            return <Item name={item.name} info={item.info} image={item.image}></Item>
        })
    }
    render() {
        return (
            <div>
                {this.renderItems()}
            </div>
        )
    }
}
