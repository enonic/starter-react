import React from 'react';

export default class ToasterComponent extends React.PureComponent {
    constructor(arg){
        super(arg)
        
    }

    toggleVisible(){
        this.props.toggleVisible(this.props.item)
    }

    render(){
        const {
            visible,
            message
        } = this.props
        return (
            <div>
                {visible ? message : null}
            </div>
        )
    }
}